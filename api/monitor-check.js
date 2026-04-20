// api/monitor-check.js — Vercel serverless function
// Triggered by GitHub Actions cron job (via HTTP) or directly
// POST /api/monitor-check { secret: string }
// Runs one batch of monitor checks and returns results

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is called from our cron (not the public)
  const { secret } = req.body || {};
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // TODO: implement full monitoring logic in scripts/monitor-run.js
  // This endpoint exists for Vercel-based cron fallback

  return res.status(200).json({
    ok: true,
    message: 'Monitor check endpoint ready — implementation pending',
    timestamp: new Date().toISOString()
  });
}
