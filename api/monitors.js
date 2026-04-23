// api/monitors.js — Vercel serverless function
// CRUD for user monitors. Auth via Supabase JWT (Authorization: Bearer <token>).
// RLS enforces user isolation — users only see their own monitors.
//
// GET  /api/monitors          — list all monitors for the authenticated user
// POST /api/monitors          — create a monitor
// PATCH /api/monitors?id=xxx  — update a monitor (name, frequency, paused)
// DELETE /api/monitors?id=xxx — delete a monitor

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Plan limits
const PLAN_LIMITS = { free: 2, starter: 10, pro: Infinity };

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  // Create a client scoped to this user's JWT — RLS uses this automatically
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// Seed demo monitors (from seed-demo-monitors.js)
async function handleSeedDemo(req, res, user) {
  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get plan limit
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return res.status(400).json({ error: 'User subscription not found' });
    }

    // Check current monitor count
    const { count } = await supabase
      .from('monitors')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active');

    const currentCount = count || 0;
    const plan = subscription.plan;
    const limits = { free: 2, starter: 10, pro: 999 };
    const planLimit = limits[plan] || 2;
    const availableSlots = planLimit - currentCount;

    const seedMonitors = [
      { name: 'Notion Pricing', url: 'https://www.notion.so/pricing', category: 'Productivity' },
      { name: 'Linear Pricing', url: 'https://linear.app/pricing', category: 'Project Management' },
      { name: 'Figma Pricing', url: 'https://www.figma.com/pricing', category: 'Design' },
      { name: 'Slack Pricing', url: 'https://slack.com/pricing', category: 'Communication' },
      { name: 'Zapier Pricing', url: 'https://zapier.com/pricing', category: 'Automation' },
      { name: 'Intercom Pricing', url: 'https://www.intercom.com/pricing', category: 'Customer Support' },
      { name: 'HubSpot Pricing', url: 'https://www.hubspot.com/pricing', category: 'CRM' },
      { name: 'Airtable Pricing', url: 'https://airtable.com/pricing', category: 'Database' },
      { name: 'Loom Pricing', url: 'https://www.loom.com/pricing', category: 'Video' },
      { name: 'Typeform Pricing', url: 'https://www.typeform.com/pricing', category: 'Forms' },
      { name: 'Webflow Pricing', url: 'https://webflow.com/pricing', category: 'Web Design' },
      { name: 'Monday.com Pricing', url: 'https://monday.com/pricing', category: 'Work OS' },
      { name: 'Ahrefs Pricing', url: 'https://ahrefs.com/pricing', category: 'SEO Tools' }
    ];

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

    const now = new Date().toISOString();
    const monitorsToCreate = seedMonitors.slice(0, requestedCount).map(m => ({
      user_id: user.id,
      name: m.name,
      url: m.url,
      frequency: plan === 'free' ? 'daily' : 'hourly',
      status: 'active',
      consecutive_errors: 0,
      next_check_at: now,
      created_at: now,
      updated_at: now,
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the session is valid and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('monitors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ monitors: data });
  }

  // ── POST ─────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    // Route to seed-demo-monitors logic if ?action=seed
    if (req.query?.action === 'seed') {
      return handleSeedDemo(req, res, user);
    }

    const { name, url, frequency = 'daily', selector } = req.body || {};

    if (!name || !url) {
      return res.status(400).json({ error: 'name and url are required' });
    }

    // Validate URL
    try { new URL(url); } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Enforce plan limits
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    const plan = sub?.plan || 'free';
    const limit = PLAN_LIMITS[plan] ?? 2;

    const { count } = await supabase
      .from('monitors')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if ((count || 0) >= limit) {
      return res.status(403).json({
        error: `Plan limit reached (${limit} monitors on ${plan} plan). Upgrade to add more.`,
        upgrade_url: '/pricing.html',
      });
    }

    // Validate frequency
    const validFrequencies = ['hourly', 'daily', 'weekly'];
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({ error: 'frequency must be hourly, daily, or weekly' });
    }

    // Enforce tier-gated frequencies
    if (frequency === 'hourly' && plan === 'free') {
      return res.status(403).json({ error: 'Hourly monitoring requires Starter or Pro plan' });
    }

    const now = new Date().toISOString();
    const { data: monitor, error: insertError } = await supabase
      .from('monitors')
      .insert({
        user_id: user.id,
        name: name.trim(),
        url: url.trim(),
        frequency,
        selector: selector || null,
        status: 'active',
        consecutive_errors: 0,
        created_at: now,
        updated_at: now,
        next_check_at: now, // check immediately on first run
      })
      .select()
      .single();

    if (insertError) return res.status(500).json({ error: insertError.message });
    return res.status(201).json({ monitor });
  }

  // ── PATCH ────────────────────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });

    const { name, frequency, status, selector } = req.body || {};
    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name.trim();
    if (frequency !== undefined) updates.frequency = frequency;
    if (status !== undefined && ['active', 'paused'].includes(status)) updates.status = status;
    if (selector !== undefined) updates.selector = selector;

    const { data, error } = await supabase
      .from('monitors')
      .update(updates)
      .eq('id', id)
      // RLS ensures user can only update their own monitors
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Monitor not found' });
    return res.status(200).json({ monitor: data });
  }

  // ── DELETE ───────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });

    const { error } = await supabase
      .from('monitors')
      .delete()
      .eq('id', id);
    // RLS ensures user can only delete their own monitors

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
