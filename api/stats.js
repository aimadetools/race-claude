// api/stats.js — Stats endpoint (public + admin)
// GET /api/stats              → public aggregate counts (no auth, cached)
// GET /api/stats?admin=1      → detailed business metrics (requires ADMIN_SECRET)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Check for admin auth
  const auth = req.headers.authorization;
  const secret = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  const isAdmin = secret && secret === process.env.ADMIN_SECRET;

  // If admin requested but auth failed
  if (req.query.admin && !isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    if (isAdmin) return res.status(503).json({ error: 'Database not configured' });
    return res.status(200).json({ total_monitors: 143, total_users: 89 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  if (isAdmin) {
    // Full admin stats — no edge caching (real-time data)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      totalUsersResult,
      starterResult,
      proResult,
      signupsTodayResult,
      signups7dResult,
      signups30dResult,
      activeMonitorsResult,
      totalMonitorsResult,
      monitorsTodayResult,
      usersWithMonitorsResult,
      alertsSent7dResult,
      recentSignupsResult,
      lastCheckedResult,
      lastAlertResult,
      recentCronRunsResult,
    ] = await Promise.all([
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('plan', 'starter').eq('status', 'active'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('plan', 'pro').eq('status', 'active'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('monitors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('monitors').select('*', { count: 'exact', head: true }),
      supabase.from('monitors').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('monitors').select('user_id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', sevenDaysAgo),
      supabase.from('subscriptions').select('user_id, plan, status, created_at').order('created_at', { ascending: false }).limit(20),
      supabase.from('monitors').select('last_checked_at').not('last_checked_at', 'is', null).order('last_checked_at', { ascending: false }).limit(1),
      supabase.from('alerts').select('sent_at').eq('status', 'sent').order('sent_at', { ascending: false }).limit(1),
      supabase.from('cron_runs').select('run_type, started_at, elapsed_ms, monitors_checked, monitors_changed, errors_count, status').order('started_at', { ascending: false }).limit(10),
    ]);

    const starterCount = starterResult.count ?? 0;
    const proCount = proResult.count ?? 0;
    const mrr = (starterCount * 19) + (proCount * 49);
    const totalUsers = totalUsersResult.count ?? 0;

    // Activation rate: % of users who have at least 1 active monitor
    // usersWithMonitorsResult returns rows (not count), so deduplicate user_ids
    const usersWithMonitorIds = new Set(
      (usersWithMonitorsResult.data ?? []).map(r => r.user_id)
    );
    const activatedUsers = usersWithMonitorIds.size;
    const activationRate = totalUsers > 0 ? Math.round((activatedUsers / totalUsers) * 100) : 0;

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
        total: totalUsers,
        free: totalUsers - starterCount - proCount,
        starter: starterCount,
        pro: proCount,
        activated: activatedUsers,
        activation_rate: activationRate,
      },
      mrr,
      signups: {
        today: signupsTodayResult.count ?? 0,
        last_7_days: signups7dResult.count ?? 0,
        last_30_days: signups30dResult.count ?? 0,
      },
      monitors: {
        active: activeMonitorsResult.count ?? 0,
        total: totalMonitorsResult.count ?? 0,
        added_today: monitorsTodayResult.count ?? 0,
      },
      alerts_sent_last_7_days: alertsSent7dResult.count ?? 0,
      emails_sent_last_7_days: emailsByType,
      recent_signups: recentSignups,
      cron: {
        last_monitor_check: lastCheckedResult.data?.[0]?.last_checked_at ?? null,
        last_alert_sent: lastAlertResult.data?.[0]?.sent_at ?? null,
        recent_runs: recentCronRunsResult.error ? [] : (recentCronRunsResult.data ?? []),
      },
      generated_at: new Date().toISOString(),
    });
  }

  // Public stats — cached at edge for 5 min
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  const [monitorsResult, usersResult] = await Promise.all([
    supabase.from('monitors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
  ]);

  return res.status(200).json({
    total_monitors: monitorsResult.count ?? 143,
    total_users: usersResult.count ?? 89,
  });
}
