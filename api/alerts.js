// api/alerts.js — Vercel serverless function
// List recent alerts for the authenticated user.
// Auth via Supabase JWT (Authorization: Bearer <token>).
//
// GET /api/alerts?limit=20&offset=0   — paginated alert list
// GET /api/alerts?monitor_id=xxx      — alerts for a specific monitor

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired session' });

  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const monitorId = req.query.monitor_id;

  let query = supabase
    .from('alerts')
    .select(`
      id, status, channel, sent_at, created_at, error_text,
      monitors ( id, name, url )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (monitorId) query = query.eq('monitor_id', monitorId);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ alerts: data, limit, offset });
}
