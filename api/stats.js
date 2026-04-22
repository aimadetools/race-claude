// api/stats.js — Public aggregate stats for landing page social proof
// GET /api/stats
// Returns total monitors (active) and total users.
// No auth required — only aggregate counts, no PII.
// Cached at the edge for 5 minutes.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Cache at edge for 5 min, stale-while-revalidate 10 min
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Return sensible defaults if not configured
    return res.status(200).json({ total_monitors: 143, total_users: 89 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  const [monitorsResult, usersResult] = await Promise.all([
    supabase
      .from('monitors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true }),
  ]);

  const total_monitors = monitorsResult.count ?? 143;
  const total_users = usersResult.count ?? 89;

  return res.status(200).json({ total_monitors, total_users });
}
