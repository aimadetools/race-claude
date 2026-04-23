// api/send-alerts.js — Vercel serverless function
// Processes pending alerts from the alerts table and sends them via Resend.
// Called by the GitHub Actions cron after monitor-run.js completes.
// POST /api/send-alerts { secret: string }
//
// Reads pending alerts, sends emails, marks as sent (or failed).
// Designed for batches: sends up to 50 pending alerts per invocation.

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'PricePulse <alerts@getpricepulse.com>';
const BATCH_LIMIT = 50;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Email not configured (RESEND_API_KEY missing)' });
  }

  // Use service key for system reads (no user JWT)
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  // Fetch pending alerts with monitor + diff data
  const { data: pending, error: fetchErr } = await supabase
    .from('alerts')
    .select(`
      id, channel, user_id, monitor_id,
      monitors ( name, url, alert_email ),
      diffs ( diff_lines, significance_score, detected_at )
    `)
    .eq('status', 'pending')
    .eq('channel', 'email')
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

    // Get the recipient email: monitor's alert_email, or fall back to auth user email
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

    const html = buildEmailHtml({
      monitorName: monitor.name,
      url: monitor.url,
      diffPreview,
      detectedAt: diff?.detected_at || new Date().toISOString(),
      significance: diff?.significance_score || 1.0,
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

async function markAlert(supabase, alertId, status, errorText) {
  const update = { status, sent_at: status === 'sent' ? new Date().toISOString() : null };
  if (errorText) update.error_text = errorText;
  await supabase.from('alerts').update(update).eq('id', alertId);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml({ monitorName, url, diffPreview, detectedAt, significance }) {
  const date = new Date(detectedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
  });
  const confidenceLabel = significance >= 0.8 ? 'High' : significance >= 0.5 ? 'Medium' : 'Low';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e2e8f0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1a1d27;border-radius:12px;overflow:hidden;border:1px solid #2a2d3a">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#4f6ef7,#7c3aed);padding:32px 40px">
  <div style="font-size:22px;font-weight:700;color:#fff">⚡ Pricing change detected</div>
  <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:4px">${escHtml(monitorName)}</div>
</td></tr>

<!-- Body -->
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

  ${diffPreview ? `
  <div style="margin-bottom:24px">
    <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">What changed</div>
    <div style="background:#0f1117;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;line-height:1.6;border:1px solid #2a2d3a;overflow-x:auto">
      ${diffPreview}
    </div>
  </div>
  ` : ''}

  <a href="${escHtml(url)}" style="display:inline-block;background:linear-gradient(135deg,#4f6ef7,#7c3aed);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600">View pricing page →</a>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 40px;border-top:1px solid #2a2d3a">
  <p style="font-size:12px;color:#64748b;margin:0">
    You're receiving this because you monitor <strong style="color:#94a3b8">${escHtml(monitorName)}</strong> on PricePulse.
    <a href="${process.env.APP_URL || 'https://getpricepulse.com'}/dashboard.html" style="color:#4f6ef7">Manage alerts →</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
