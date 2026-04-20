#!/usr/bin/env node
// scripts/monitor-run.js
// Main monitoring loop — run by GitHub Actions every hour
// Fetches active monitors from Supabase, checks each URL for changes,
// stores snapshots, and sends alerts on diffs.
//
// STATUS: Skeleton — full implementation tracked in BACKLOG-PREMIUM [P1]

import { createClient } from '@supabase/supabase-js';

const DRY_RUN = process.env.DRY_RUN === 'true';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function main() {
  console.log(`[monitor-run] Starting — ${new Date().toISOString()} dry_run=${DRY_RUN}`);

  // TODO [P1]: fetch active monitors from supabase
  // const { data: monitors } = await supabase.from('monitors').select('*').eq('active', true);

  // TODO [P1]: for each monitor, fetch the URL and compare to last snapshot
  // TODO [P1]: if diff detected, store new snapshot and trigger alert
  // TODO [P5]: apply noise-filtering to avoid false positives

  console.log('[monitor-run] Skeleton run complete — no monitors configured yet');
  process.exit(0);
}

main().catch(err => {
  console.error('[monitor-run] Fatal error:', err);
  process.exit(1);
});
