// api/alerts.js — Vercel serverless function
// List recent alerts for authenticated user (GET), or process pending alerts via cron (POST).
// Auth: Supabase JWT for GET, CRON_SECRET for POST.
//
// GET /api/alerts?limit=20&offset=0   — paginated alert list
// GET /api/alerts?monitor_id=xxx      — alerts for a specific monitor
// POST /api/alerts { secret: string } — send pending alerts (cron job)

import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'PricePulse <alerts@getpricepulse.com>';
const APP_URL = process.env.APP_URL || 'https://getpricepulse.com';
const BATCH_LIMIT = 50;

function getAuthedClient(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

function getServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateUnsubscribeLink(userId) {
  // Create unsubscribe token: userId:timestamp:hmac(userId:timestamp)
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = process.env.CRON_SECRET || 'default-secret';
  const signature = createHmac('sha256', secret)
    .update(`${userId}:${timestamp}`)
    .digest('hex');
  const token = `${userId}:${timestamp}:${signature}`;
  return `${APP_URL}/api/unsubscribe?token=${token}&type=alerts`;
}

function buildAlertEmailHtml({ monitorName, url, diffPreview, detectedAt, significance, userId }) {
  const date = new Date(detectedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
  });
  const confidenceLabel = significance >= 0.8 ? 'High' : significance >= 0.5 ? 'Medium' : 'Low';
  const unsubscribeLink = generateUnsubscribeLink(userId);

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e2e8f0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1a1d27;border-radius:12px;overflow:hidden;border:1px solid #2a2d3a">
<tr><td style="background:linear-gradient(135deg,#4f6ef7,#7c3aed);padding:32px 40px">
  <div style="font-size:22px;font-weight:700;color:#fff">⚡ Pricing change detected</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:4px">${escHtml(monitorName)}</div>
</td></tr>
<tr><td style="padding:32px 40px">
  <div style="margin-bottom:24px">
    <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Monitored URL</div>
    <a href="${escHtml(url)}" style="color:#4f6ef7;text-decoration:none;font-size:14px;word-break:break-all">${escHtml(url)}</a>
  </div>
  <div style="margin-bottom:24px;display:flex;gap:24px">
    <div>
      <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Detected</div>
      <div style="font-size:14px;color:#e2e8f0">${date} UTC</div>
    </div>
    <div>
      <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Confidence</div>
      <div style="font-size:14px;color:#e2e8f0">${confidenceLabel} (${Math.round(significance * 100)}%)</div>
    </div>
  </div>
  ${diffPreview ? `<div style="margin-bottom:24px">
    <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">What changed</div>
    <div style="background:#0f1117;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;line-height:1.6;border:1px solid #2a2d3a;overflow-x:auto">${diffPreview}</div>
  </div>` : ''}
  <a href="${escHtml(url)}" style="display:inline-block;background:linear-gradient(135deg,#4f6ef7,#7c3aed);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">View pricing page →</a>
</td></tr>
<tr><td style="padding:24px 40px;border-top:1px solid #2a2d3a">
  <p style="font-size:12px;color:#64748b;margin:0">You're receiving this because you monitor <strong style="color:#94a3b8">${escHtml(monitorName)}</strong> on PricePulse. <a href="${APP_URL}/dashboard.html" style="color:#4f6ef7">Manage alerts →</a> · <a href="${unsubscribeLink}" style="color:#64748b;text-decoration:underline">Unsubscribe from alerts</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

async function markAlert(supabase, alertId, status, errorText) {
  const update = { status, sent_at: status === 'sent' ? new Date().toISOString() : null };
  if (errorText) update.error_text = errorText;
  await supabase.from('alerts').update(update).eq('id', alertId);
}

async function handleSendAlerts(req, res) {
  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Email not configured (RESEND_API_KEY missing)' });
  }

  const supabase = getServiceClient();

  const { data: pending, error: fetchErr } = await supabase
    .from('alerts')
    .select(`
      id, channel, user_id, monitor_id,
      monitors ( name, url, alert_email ),
      diffs ( diff_lines, significance_score, detected_at ),
      subscriptions!inner ( alerts_unsubscribed )
    `)
    .eq('status', 'pending')
    .eq('channel', 'email')
    .eq('subscriptions.alerts_unsubscribed', false)
    .order('created_at', { ascending: true })
    .limit(BATCH_LIMIT);

  if (fetchErr) return res.status(500).json({ error: fetchErr.message });
  if (!pending?.length) return res.status(200).json({ ok: true, sent: 0, message: 'No pending alerts' });

  let sent = 0;
  let failed = 0;

  for (const alert of pending) {
    const monitor = alert.monitors;
    const diff = alert.diffs;
    if (!monitor) continue;

    let toEmail = monitor.alert_email;
    if (!toEmail) {
      const { data: authUser } = await supabase.auth.admin.getUserById(alert.user_id);
      toEmail = authUser?.user?.email;
    }

    if (!toEmail) {
      await markAlert(supabase, alert.id, 'failed', 'No recipient email found');
      failed++;
      continue;
    }

    const subject = `Pricing change detected: ${monitor.name}`;
    const changedLines = diff?.diff_lines?.slice(0, 20) || [];
    const diffPreview = changedLines.map(l => {
      if (l.startsWith('+')) return `<span style="color:#22c55e">${escHtml(l)}</span>`;
      if (l.startsWith('-')) return `<span style="color:#ef4444">${escHtml(l)}</span>`;
      return `<span style="color:#9ca3af">${escHtml(l)}</span>`;
    }).join('<br>');

    const html = buildAlertEmailHtml({
      monitorName: monitor.name,
      url: monitor.url,
      diffPreview,
      detectedAt: diff?.detected_at || new Date().toISOString(),
      significance: diff?.significance_score || 1.0,
      userId: alert.user_id,
    });

    try {
      const emailRes = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: [toEmail],
          subject,
          html,
        }),
      });

      if (emailRes.ok) {
        await markAlert(supabase, alert.id, 'sent');
        sent++;
      } else {
        const errBody = await emailRes.text();
        await markAlert(supabase, alert.id, 'failed', errBody.slice(0, 200));
        failed++;
        console.error(`[send-alerts] Resend error for alert ${alert.id}:`, errBody);
      }
    } catch (err) {
      await markAlert(supabase, alert.id, 'failed', err.message);
      failed++;
      console.error(`[send-alerts] Network error for alert ${alert.id}:`, err.message);
    }
  }

  return res.status(200).json({ ok: true, sent, failed, total: pending.length });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Route POST requests to send-alerts handler (cron job)
  if (req.method === 'POST') {
    return handleSendAlerts(req, res);
  }

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
