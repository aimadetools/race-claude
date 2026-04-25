// api/monitor-check.js — Vercel serverless function
// Called by external cron (cron-job.org) every hour to trigger monitoring.
// POST /api/monitor-check { secret: string }
//
// Runs a batch of due monitors inline.
// Note: Vercel hobby tier has a 10s execution limit. Keep BATCH_SIZE small.
// For larger scale, the VPS cron runs monitor-run.js directly (no timeout).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  try {
    // Dynamically import to avoid bundling issues with cheerio/node-fetch
    // monitor-run.js exports main() — it won't auto-execute on import
    const { main } = await import('../scripts/monitor-run.js');
    await main();

    return res.status(200).json({
      ok: true,
      message: 'Monitor run complete',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[monitor-check] Error:', err);
    return res.status(500).json({
      error: 'Monitor run failed',
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
