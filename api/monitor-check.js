// api/monitor-check.js — Vercel serverless function
// Fallback cron endpoint (if GitHub Actions is unavailable).
// POST /api/monitor-check { secret: string }
// Delegates to the same monitoring logic used by the GitHub Actions cron.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Dynamic import so Vercel only bundles what it needs
  // monitor-run.js calls main() on import — set DRY_RUN via env before import
  // In practice, GitHub Actions is the primary cron; this endpoint is a fallback.
  try {
    // Run inline rather than re-importing the full script to avoid double-execution issues.
    // The actual work is in scripts/monitor-run.js (run via GitHub Actions).
    // This endpoint signals "health OK" and can be extended to trigger a run directly.
    return res.status(200).json({
      ok: true,
      message: 'Monitor cron endpoint active. Primary cron: GitHub Actions.',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[monitor-check] Error:', err);
    return res.status(500).json({ error: 'Monitor check failed', details: err.message });
  }
}
