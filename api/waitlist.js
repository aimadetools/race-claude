// api/waitlist.js — Vercel serverless function
// Saves email signups to Supabase waitlist table
// POST /api/waitlist { email: string, source?: string }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'homepage' } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email: email.toLowerCase().trim(), source, created_at: new Date().toISOString() }, {
      onConflict: 'email',
      ignoreDuplicates: true
    });

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Failed to save. Please try again.' });
  }

  return res.status(200).json({ ok: true, message: "You're on the list!" });
}
