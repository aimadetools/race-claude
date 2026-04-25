#!/usr/bin/env node
// scripts/monitor-run.js
// Main monitoring loop — run by VPS cron every hour at :00.
// Fetches active monitors from Supabase, checks each URL for changes,
// stores snapshots, and queues alerts on diffs.

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { extractPricingContent, computeDiff, scoreDiff } from './noise-filter.js';

const DRY_RUN = process.env.DRY_RUN === 'true';
const BATCH_SIZE = 10;       // URLs to check per run (stay within Vercel 30s limit)
const FETCH_TIMEOUT_MS = 7_000; // 7s per fetch; 10 fetches ≈ 15s typical, 70s worst-case
const MIN_SIGNIFICANCE = 0.3; // Diffs below this score are silently discarded

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ──────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────
async function main() {
  const startedAt = new Date();
  console.log(`[monitor-run] Starting — ${startedAt.toISOString()} dry_run=${DRY_RUN}`);

  const monitors = await fetchDueMonitors();
  console.log(`[monitor-run] ${monitors.length} monitors due for checking`);

  let checked = 0, changed = 0, errors = 0;

  for (const monitor of monitors) {
    try {
      const didChange = await checkMonitor(monitor);
      checked++;
      if (didChange) changed++;
    } catch (err) {
      errors++;
      console.error(`[monitor-run] Error on monitor ${monitor.id} (${monitor.url}):`, err.message);
      await recordMonitorError(monitor.id, monitor.consecutive_errors + 1);
    }
  }

  const elapsedMs = Date.now() - startedAt;
  console.log(`[monitor-run] Done — checked=${checked} changed=${changed} errors=${errors} elapsed=${elapsedMs}ms`);

  if (!DRY_RUN) {
    await logCronRun({
      run_type: 'monitor_check',
      started_at: startedAt.toISOString(),
      elapsed_ms: elapsedMs,
      monitors_checked: checked,
      monitors_changed: changed,
      errors_count: errors,
      status: errors > 0 && checked === 0 ? 'error' : errors > 0 ? 'partial' : 'success',
    });
  }
}

// ──────────────────────────────────────────────────────────────
// Log a cron run outcome to Supabase (best-effort, never throws)
// ──────────────────────────────────────────────────────────────
async function logCronRun(data) {
  try {
    const { error } = await supabase.from('cron_runs').insert({
      run_type:         data.run_type,
      started_at:       data.started_at,
      finished_at:      new Date().toISOString(),
      elapsed_ms:       data.elapsed_ms,
      monitors_checked: data.monitors_checked ?? 0,
      monitors_changed: data.monitors_changed ?? 0,
      errors_count:     data.errors_count ?? 0,
      status:           data.status ?? 'success',
      notes:            data.notes ?? null,
    });
    if (error) console.warn('[monitor-run] logCronRun warning:', error.message);
  } catch (err) {
    console.warn('[monitor-run] logCronRun failed (non-fatal):', err.message);
  }
}

// ──────────────────────────────────────────────────────────────
// Fetch monitors that are due for a check
// ──────────────────────────────────────────────────────────────
async function fetchDueMonitors() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('monitors')
    .select('id, url, name, frequency, last_checked_at, next_check_at, consecutive_errors, alert_email, user_id')
    .eq('status', 'active')
    .lte('next_check_at', new Date().toISOString())
    .order('next_check_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (error) throw new Error(`Failed to fetch monitors: ${error.message}`);
  return data ?? [];
}

// ──────────────────────────────────────────────────────────────
// Check one monitor
// ──────────────────────────────────────────────────────────────
async function checkMonitor(monitor) {
  const { id, url, frequency = 'daily' } = monitor;
  console.log(`[check] ${url}`);

  // 1. Fetch page
  const html = await fetchPage(url);

  // 2. Extract pricing content and compute hash
  const contentText = extractPricingContent(html, url);
  const contentHash = sha256(contentText);

  // 3. Load last snapshot
  const lastSnapshot = await getLastSnapshot(id);

  let changed = false;

  if (!lastSnapshot) {
    // First check — just store baseline, no alert
    console.log(`[check] First snapshot for ${url}`);
    if (!DRY_RUN) {
      await storeSnapshot(id, contentHash, contentText);
      await markChecked(id, frequency);
    }
  } else if (lastSnapshot.content_hash !== contentHash) {
    // Content changed — compute diff and score it
    const diffLines = computeDiff(lastSnapshot.content_text, contentText);
    const score = scoreDiff(diffLines);

    console.log(`[check] Change detected at ${url} — significance=${score.toFixed(2)} diff_lines=${diffLines.length}`);

    if (score >= MIN_SIGNIFICANCE) {
      changed = true;
      if (!DRY_RUN) {
        const newSnapshot = await storeSnapshot(id, contentHash, contentText);
        await storeDiff(id, lastSnapshot.id, newSnapshot.id, diffLines, score);
        await markChanged(id, frequency);
        await queueAlerts(id);
      } else {
        console.log('[dry-run] Would store diff and queue alerts');
        console.log('[dry-run] Changed lines:', diffLines.slice(0, 10).join('\n'));
      }
    } else {
      console.log(`[check] Change below significance threshold (${score.toFixed(2)}) — ignoring`);
      // Update snapshot silently (don't alert, but update baseline to avoid repeated low-signal noise)
      if (!DRY_RUN) {
        await storeSnapshot(id, contentHash, contentText);
        await markChecked(id, frequency);
      }
    }
  } else {
    console.log(`[check] No change at ${url}`);
    if (!DRY_RUN) await markChecked(id, frequency);
  }

  return changed;
}

// ──────────────────────────────────────────────────────────────
// HTTP fetch with timeout and basic retry
// ──────────────────────────────────────────────────────────────
async function fetchPage(url, attempt = 1) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PricePulse/1.0; +https://getpricepulse.com/bot)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.text();
  } catch (err) {
    if (attempt < 2 && err.name !== 'AbortError') {
      console.warn(`[fetch] Retry ${attempt + 1} for ${url}: ${err.message}`);
      await sleep(3000);
      return fetchPage(url, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ──────────────────────────────────────────────────────────────
// Supabase helpers
// ──────────────────────────────────────────────────────────────
async function getLastSnapshot(monitorId) {
  const { data, error } = await supabase
    .from('snapshots')
    .select('id, content_hash, content_text')
    .eq('monitor_id', monitorId)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getLastSnapshot: ${error.message}`);
  return data;
}

async function storeSnapshot(monitorId, contentHash, contentText) {
  const { data, error } = await supabase
    .from('snapshots')
    .insert({ monitor_id: monitorId, content_hash: contentHash, content_text: contentText })
    .select('id')
    .single();

  if (error) throw new Error(`storeSnapshot: ${error.message}`);
  return data;
}

async function storeDiff(monitorId, beforeId, afterId, diffLines, score) {
  const { error } = await supabase
    .from('diffs')
    .insert({
      monitor_id: monitorId,
      snapshot_before_id: beforeId,
      snapshot_after_id: afterId,
      diff_lines: diffLines,
      significance_score: score,
    });

  if (error) throw new Error(`storeDiff: ${error.message}`);
}

function nextCheckAt(frequency) {
  const d = new Date();
  if (frequency === 'hourly') d.setHours(d.getHours() + 1);
  else if (frequency === 'weekly') d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 1); // daily default
  return d.toISOString();
}

async function markChecked(monitorId, frequency = 'daily') {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('monitors')
    .update({ last_checked_at: now, next_check_at: nextCheckAt(frequency), consecutive_errors: 0 })
    .eq('id', monitorId);

  if (error) console.error(`markChecked failed: ${error.message}`);
}

async function markChanged(monitorId, frequency = 'daily') {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('monitors')
    .update({
      last_checked_at: now,
      last_changed_at: now,
      next_check_at: nextCheckAt(frequency),
      consecutive_errors: 0,
    })
    .eq('id', monitorId);

  if (error) console.error(`markChanged failed: ${error.message}`);
}

async function recordMonitorError(monitorId, errorCount) {
  const update = { consecutive_errors: errorCount, last_checked_at: new Date().toISOString() };
  // Disable monitor after 10 consecutive errors (saves quota)
  if (errorCount >= 10) update.status = 'paused'; // auto-pause after repeated failures

  const { error } = await supabase
    .from('monitors')
    .update(update)
    .eq('id', monitorId);

  if (error) console.error(`recordMonitorError failed: ${error.message}`);
}

async function queueAlerts(monitorId) {
  // Load pending diffs for this monitor that haven't been alerted yet
  const { data: diffs, error: diffErr } = await supabase
    .from('diffs')
    .select('id')
    .eq('monitor_id', monitorId)
    .order('detected_at', { ascending: false })
    .limit(1);

  if (diffErr || !diffs?.length) return;
  const diffId = diffs[0].id;

  // Find the monitor owner
  const { data: monitor, error: monErr } = await supabase
    .from('monitors')
    .select('user_id')
    .eq('id', monitorId)
    .single();

  if (monErr || !monitor) return;

  // Load their alert configs (global + monitor-specific)
  const { data: configs } = await supabase
    .from('alert_configs')
    .select('id, channel')
    .eq('user_id', monitor.user_id)
    .eq('active', true)
    .or(`monitor_id.is.null,monitor_id.eq.${monitorId}`);

  if (!configs?.length) {
    // Default: queue an email alert even with no explicit config
    await insertAlert(monitor.user_id, monitorId, diffId, 'email');
    return;
  }

  for (const config of configs) {
    await insertAlert(monitor.user_id, monitorId, diffId, config.channel);
  }
}

async function insertAlert(userId, monitorId, diffId, channel) {
  const { error } = await supabase
    .from('alerts')
    .insert({ user_id: userId, monitor_id: monitorId, diff_id: diffId, channel, status: 'pending' });

  if (error) console.error(`insertAlert failed: ${error.message}`);
}

// ──────────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────────
function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────────────────────────
// Export for use as a module (e.g. from api/monitor-check.js)
// When run directly as a script, call main() immediately.
export { main, logCronRun };

if (process.argv[1] && process.argv[1].endsWith('monitor-run.js')) {
  main().catch(err => {
    console.error('[monitor-run] Fatal error:', err);
    process.exit(1);
  });
}
