// api/admin-stats.js — Internal admin stats endpoint
// GET /api/admin-stats
// Auth: Authorization: Bearer <ADMIN_SECRET>
// Returns business metrics: users, MRR, signups, monitors, alerts, emails.
// Never exposed to end users. ADMIN_SECRET set in Vercel env vars.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Auth check
  const auth = req.headers.authorization;
  const secret = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalUsersResult,
    starterResult,
    proResult,
    signups7dResult,
    signups30dResult,
    activeMonitorsResult,
    totalMonitorsResult,
    alertsSent7dResult,
    recentSignupsResult,
  ] = await Promise.all([
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('plan', 'starter').eq('status', 'active'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('plan', 'pro').eq('status', 'active'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    supabase.from('monitors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('monitors').select('*', { count: 'exact', head: true }),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', sevenDaysAgo),
    supabase.from('subscriptions').select('user_id, plan, status, created_at').order('created_at', { ascending: false }).limit(20),
  ]);

  const starterCount = starterResult.count ?? 0;
  const proCount = proResult.count ?? 0;
  const mrr = (starterCount * 19) + (proCount * 49);

  // Try to get email_log stats (table may not exist yet)
  const emailsResult = await supabase
    .from('email_log')
    .select('email_type, sent_at')
    .gte('sent_at', sevenDaysAgo);

  let emailsByType = {};
  if (!emailsResult.error && emailsResult.data) {
    for (const row of emailsResult.data) {
      emailsByType[row.email_type] = (emailsByType[row.email_type] || 0) + 1;
    }
  }

  // Enrich recent signups with auth email
  const recentSignups = [];
  if (recentSignupsResult.data) {
    for (const sub of recentSignupsResult.data.slice(0, 10)) {
      const { data: authData } = await supabase.auth.admin.getUserById(sub.user_id);
      recentSignups.push({
        email: authData?.user?.email || 'unknown',
        plan: sub.plan,
        status: sub.status,
        created_at: sub.created_at,
      });
    }
  }

  return res.status(200).json({
    users: {
      total: totalUsersResult.count ?? 0,
      free: (totalUsersResult.count ?? 0) - starterCount - proCount,
      starter: starterCount,
      pro: proCount,
    },
    mrr,
    signups: {
      last_7_days: signups7dResult.count ?? 0,
      last_30_days: signups30dResult.count ?? 0,
    },
    monitors: {
      active: activeMonitorsResult.count ?? 0,
      total: totalMonitorsResult.count ?? 0,
    },
    alerts_sent_last_7_days: alertsSent7dResult.count ?? 0,
    emails_sent_last_7_days: emailsByType,
    recent_signups: recentSignups,
    generated_at: new Date().toISOString(),
  });
}
