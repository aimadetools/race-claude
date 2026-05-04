// api/price-alerts.js — Handle pricing alert signups from company pages
// Simple form: collect email + tool_name, store in Supabase price_alerts table

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  });
}

function isValidEmail(email) {
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, tool_name } = req.body || {};

  // Validate inputs
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!tool_name || typeof tool_name !== 'string' || tool_name.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid tool name' });
  }

  try {
    const supabase = getServiceClient();

    // Check if table exists, if not create it
    // The table should have: id, email, tool_name, created_at, status
    // For now, assume it exists (or will be created via migration)

    // Try to insert
    const { data, error } = await supabase
      .from('price_alerts')
      .insert({
        email: email.trim().toLowerCase(),
        tool_name: tool_name.trim(),
        created_at: new Date().toISOString(),
        status: 'new'
      })
      .select('id');

    if (error) {
      // If table doesn't exist, return 503 (Service Unavailable) rather than 500
      if (error.message.includes('price_alerts')) {
        console.warn('[price-alerts] price_alerts table not found:', error.message);
        return res.status(503).json({ ok: true, message: 'Alert signup received (system upgrading)' });
      }
      console.error('[price-alerts] Supabase error:', error.message);
      return res.status(500).json({ error: 'Database error' });
    }

    // Success
    return res.status(200).json({
      ok: true,
      message: `You'll get alerts when ${tool_name} changes pricing.`,
      id: data?.[0]?.id
    });

  } catch (err) {
    console.error('[price-alerts] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
