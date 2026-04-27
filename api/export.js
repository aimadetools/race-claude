// api/export.js — CSV export of user's monitors
// GET /api/export          — returns monitors as CSV
// GET /api/export?format=json — returns monitors as JSON

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

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getAuthedClient(req.headers.authorization);
  if (!supabase) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const { data: monitors, error } = await supabase
    .from('monitors')
    .select('id, name, url, frequency, status, consecutive_errors, last_checked_at, last_changed_at, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const format = req.query?.format;

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="pricepulse-monitors.json"');
    return res.status(200).json({ monitors, exported_at: new Date().toISOString() });
  }

  // Default: CSV
  const headers = ['ID', 'Name', 'URL', 'Frequency', 'Status', 'Consecutive Errors', 'Last Checked', 'Last Changed', 'Created At'];
  const rows = monitors.map(m => [
    m.id,
    m.name,
    m.url,
    m.frequency,
    m.status,
    m.consecutive_errors,
    m.last_checked_at || '',
    m.last_changed_at || '',
    m.created_at,
  ].map(escapeCSV).join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="pricepulse-monitors.csv"');
  return res.status(200).send(csv);
}
