// api/slack.js — Vercel serverless function
// Manage Slack webhook integration for PricePulse alerts.
//
// GET    /api/slack            — returns current Slack config (is webhook set?)
// POST   /api/slack            — save Slack webhook URL
// POST   /api/slack?test=true  — send a test Slack message
// DELETE /api/slack            — remove Slack integration
//
// Auth: Supabase JWT via Authorization header.
// Slack support is available on Starter and Pro plans only.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const APP_URL = process.env.APP_URL || 'https://getpricepulse.com';

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

function buildTestSlackPayload() {
  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '✅ PricePulse connected!' },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Your Slack integration is working. You\'ll receive alerts like this one whenever a competitor changes their pricing.',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*Example monitor:*\nNotion Pricing' },
          { type: 'mrkdwn', text: '*Status:*\n✅ Active' },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Sent from <${APP_URL}|PricePulse> · <${APP_URL}/settings.html|Manage settings>`,
          },
        ],
      },
    ],
  };
}

async function sendSlackMessage(webhookUrl, payload) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Slack returned ${res.status}: ${text}`);
  }
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired session' });

  // Check plan — Slack requires Starter or Pro
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const plan = sub?.plan || 'free';
  if (plan === 'free') {
    return res.status(403).json({
      error: 'Slack integration requires a Starter or Pro plan.',
      upgrade_url: `${APP_URL}/plan-select.html`,
    });
  }

  // ── GET: return current Slack config ──────────────────────────
  if (req.method === 'GET') {
    const { data: config } = await supabase
      .from('alert_configs')
      .select('id, config, active')
      .eq('user_id', user.id)
      .eq('channel', 'slack')
      .is('monitor_id', null)
      .maybeSingle();

    if (!config) {
      return res.status(200).json({ connected: false });
    }

    // Mask webhook URL for security — only return last 8 chars
    const webhookUrl = config.config?.webhook_url || '';
    const masked = webhookUrl ? `****${webhookUrl.slice(-8)}` : '';

    return res.status(200).json({
      connected: !!webhookUrl,
      webhook_masked: masked,
      active: config.active,
      config_id: config.id,
    });
  }

  // ── POST: save or test Slack webhook ─────────────────────────
  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { webhook_url } = body;
    const isTest = req.query.test === 'true';

    // Test mode with no body: use stored webhook config
    if (isTest && !webhook_url) {
      const { data: config } = await supabase
        .from('alert_configs')
        .select('config')
        .eq('user_id', user.id)
        .eq('channel', 'slack')
        .is('monitor_id', null)
        .maybeSingle();

      const storedUrl = config?.config?.webhook_url;
      if (!storedUrl) {
        return res.status(400).json({ error: 'No Slack webhook configured. Go to Settings to connect Slack first.' });
      }

      try {
        await sendSlackMessage(storedUrl, buildTestSlackPayload());
        return res.status(200).json({ ok: true, message: 'Test message sent to Slack!' });
      } catch (err) {
        return res.status(400).json({ error: `Slack test failed: ${err.message}` });
      }
    }

    if (!webhook_url || typeof webhook_url !== 'string') {
      return res.status(400).json({ error: 'webhook_url is required' });
    }

    if (!webhook_url.startsWith('https://hooks.slack.com/')) {
      return res.status(400).json({ error: 'webhook_url must be a Slack incoming webhook URL (https://hooks.slack.com/...)' });
    }

    // If test mode with URL, test with the provided URL (don't save)
    if (isTest) {
      try {
        await sendSlackMessage(webhook_url, buildTestSlackPayload());
        return res.status(200).json({ ok: true, message: 'Test message sent to Slack!' });
      } catch (err) {
        return res.status(400).json({ error: `Slack test failed: ${err.message}` });
      }
    }

    // Save webhook URL via upsert on (user_id, channel) with monitor_id IS NULL
    const { data: existing } = await supabase
      .from('alert_configs')
      .select('id')
      .eq('user_id', user.id)
      .eq('channel', 'slack')
      .is('monitor_id', null)
      .maybeSingle();

    let saveError;
    if (existing) {
      const { error } = await supabase
        .from('alert_configs')
        .update({ config: { webhook_url }, active: true })
        .eq('id', existing.id);
      saveError = error;
    } else {
      const { error } = await supabase
        .from('alert_configs')
        .insert({
          user_id: user.id,
          monitor_id: null,
          channel: 'slack',
          config: { webhook_url },
          active: true,
        });
      saveError = error;
    }

    if (saveError) {
      console.error('[slack] Save error:', saveError.message);
      return res.status(500).json({ error: 'Failed to save Slack configuration' });
    }

    return res.status(200).json({ ok: true, message: 'Slack integration saved.' });
  }

  // ── DELETE: remove Slack config ────────────────────────────────
  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('alert_configs')
      .delete()
      .eq('user_id', user.id)
      .eq('channel', 'slack')
      .is('monitor_id', null);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, message: 'Slack integration removed.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
