// api/feedback-summary.js — Aggregated feedback analytics
// GET /api/feedback-summary?admin=1 — Get feedback statistics (requires ADMIN_SECRET)

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

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Stub response for when Supabase not configured
    return res.status(200).json({
      total_feedback: 0,
      average_satisfaction: null,
      follow_up_count: 0,
      pricing_concerns_count: 0,
      satisfaction_distribution: { 1: 0, 2: 0, 3: 0, 4: 0 },
      category_counts: {},
      feature_requests: {},
      pricing_issues: {},
      recent_feedback: [],
      generated_at: new Date().toISOString(),
    });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );

    // Try to fetch feedback, but gracefully handle if table doesn't exist
    const { data: feedback, error: fetchError } = await supabase
      .from('feedback')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (fetchError?.code === 'PGRST116') {
      // Table doesn't exist yet
      return res.status(200).json({
        total_feedback: 0,
        average_satisfaction: null,
        follow_up_count: 0,
        pricing_concerns_count: 0,
        satisfaction_distribution: { 1: 0, 2: 0, 3: 0, 4: 0 },
        category_counts: {},
        feature_requests: {},
        pricing_issues: {},
        recent_feedback: [],
        generated_at: new Date().toISOString(),
        note: 'Feedback table not yet created. Run schema migration to enable feedback tracking.',
      });
    }

    if (fetchError) throw fetchError;

    // Aggregate feedback
    const stats = {
      total_feedback: feedback?.length || 0,
      average_satisfaction: null,
      follow_up_count: 0,
      pricing_concerns_count: 0,
      satisfaction_distribution: { 1: 0, 2: 0, 3: 0, 4: 0 },
      category_counts: {},
      feature_requests: {},
      pricing_issues: {},
      recent_feedback: [],
      generated_at: new Date().toISOString(),
    };

    if (!feedback || feedback.length === 0) {
      return res.status(200).json(stats);
    }

    // Process feedback
    let totalSatisfaction = 0;
    const featureCounts = {};
    const pricingIssueCounts = {};

    for (const item of feedback) {
      // Satisfaction
      totalSatisfaction += item.satisfaction || 0;
      stats.satisfaction_distribution[item.satisfaction] = (stats.satisfaction_distribution[item.satisfaction] || 0) + 1;

      // Category
      stats.category_counts[item.category] = (stats.category_counts[item.category] || 0) + 1;

      // Follow-up
      if (item.followup === 'yes') {
        stats.follow_up_count += 1;
      }

      // Pricing issues
      if (item.pricing_issues && Array.isArray(item.pricing_issues)) {
        stats.pricing_concerns_count += item.pricing_issues.length;
        for (const issue of item.pricing_issues) {
          pricingIssueCounts[issue] = (pricingIssueCounts[issue] || 0) + 1;
        }
      }

      // Feature requests
      if (item.top_feature) {
        featureCounts[item.top_feature] = (featureCounts[item.top_feature] || 0) + 1;
      }
    }

    // Calculate average satisfaction
    stats.average_satisfaction = feedback.length > 0
      ? (totalSatisfaction / feedback.length).toFixed(2)
      : null;

    // Top features (by count)
    stats.feature_requests = Object.entries(featureCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // Top pricing issues (by count)
    stats.pricing_issues = Object.entries(pricingIssueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // Recent feedback (last 10)
    stats.recent_feedback = feedback
      .slice(0, 10)
      .map(item => ({
        category: item.category,
        satisfaction: item.satisfaction,
        message: item.message.substring(0, 200),
        email: item.email,
        company: item.company,
        top_feature: item.top_feature,
        submitted_at: item.submitted_at,
      }));

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(stats);

  } catch (err) {
    console.error('[FEEDBACK-SUMMARY] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch feedback summary' });
  }
}
