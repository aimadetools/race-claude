/**
 * POST /api/seed-demo-monitors
 *
 * Create demo monitors for a user (for onboarding experience).
 * This endpoint creates monitors for 5 popular SaaS products so new users
 * immediately see the product working instead of an empty dashboard.
 *
 * Auth: Requires valid JWT token
 * Body: { count: 5 } (optional, default 5, max 13)
 * Returns: { created: number, monitors: array }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token' });
    }

    const token = authHeader.slice(7);

    // Verify JWT with Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = user.id;

    // Get plan limit
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      return res.status(400).json({ error: 'User subscription not found' });
    }

    // Check current monitor count
    const { data: existingMonitors, error: countError } = await supabase
      .from('monitors')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    if (countError) {
      return res.status(500).json({ error: 'Could not check monitor count' });
    }

    const currentCount = existingMonitors?.length || 0;
    const plan = subscription.plan;

    // Determine plan limits
    const limits = {
      free: 2,
      starter: 10,
      pro: 999
    };
    const planLimit = limits[plan] || 2;
    const availableSlots = planLimit - currentCount;

    // Seed companies (5 most popular for demo)
    const seedMonitors = [
      {
        name: 'Notion Pricing',
        url: 'https://www.notion.so/pricing',
        category: 'Productivity'
      },
      {
        name: 'Linear Pricing',
        url: 'https://linear.app/pricing',
        category: 'Project Management'
      },
      {
        name: 'Figma Pricing',
        url: 'https://www.figma.com/pricing',
        category: 'Design'
      },
      {
        name: 'Slack Pricing',
        url: 'https://slack.com/pricing',
        category: 'Communication'
      },
      {
        name: 'Zapier Pricing',
        url: 'https://zapier.com/pricing',
        category: 'Automation'
      },
      {
        name: 'Intercom Pricing',
        url: 'https://www.intercom.com/pricing',
        category: 'Customer Support'
      },
      {
        name: 'HubSpot Pricing',
        url: 'https://www.hubspot.com/pricing',
        category: 'CRM'
      },
      {
        name: 'Airtable Pricing',
        url: 'https://airtable.com/pricing',
        category: 'Database'
      },
      {
        name: 'Loom Pricing',
        url: 'https://www.loom.com/pricing',
        category: 'Video'
      },
      {
        name: 'Typeform Pricing',
        url: 'https://www.typeform.com/pricing',
        category: 'Forms'
      },
      {
        name: 'Webflow Pricing',
        url: 'https://webflow.com/pricing',
        category: 'Web Design'
      },
      {
        name: 'Monday.com Pricing',
        url: 'https://monday.com/pricing',
        category: 'Work OS'
      },
      {
        name: 'Ahrefs Pricing',
        url: 'https://ahrefs.com/pricing',
        category: 'SEO Tools'
      }
    ];

    // Determine how many to create
    const requestedCount = Math.min(
      (req.body?.count || 5),
      availableSlots,
      seedMonitors.length
    );

    if (requestedCount <= 0) {
      return res.status(400).json({
        error: `Plan limit reached. Current: ${currentCount}/${planLimit}. Upgrade to add more monitors.`
      });
    }

    // Create the monitors
    const monitorsToCreate = seedMonitors.slice(0, requestedCount).map(m => ({
      user_id: userId,
      name: m.name,
      url: m.url,
      frequency: plan === 'free' ? 'daily' : 'hourly',
      status: 'active',
      next_check_at: new Date().toISOString(),
      alert_email: user.email
    }));

    const { data: created, error: createError } = await supabase
      .from('monitors')
      .insert(monitorsToCreate)
      .select();

    if (createError) {
      return res.status(500).json({ error: `Could not create monitors: ${createError.message}` });
    }

    return res.status(201).json({
      success: true,
      created: created.length,
      message: `Created ${created.length} demo monitors. Start monitoring competitor pricing!`,
      monitors: created.map(m => ({
        id: m.id,
        name: m.name,
        url: m.url,
        frequency: m.frequency
      }))
    });

  } catch (err) {
    console.error('Seed monitors error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
