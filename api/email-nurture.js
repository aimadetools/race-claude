// api/email-nurture.js — Automated email nurture sequences
// POST /api/email-nurture { secret: string }
// Secured with CRON_SECRET.
//
// Sends 5 types of lifecycle emails to users:
//   welcome              — 1-3h after signup, welcome + dashboard CTA
//   first_monitor_added  — within 2h of first monitor creation
//   activation_nudge     — 24-48h after signup, no monitors yet
//   upgrade_prompt       — free user with 2 monitors (at limit)
//   reengagement         — user inactive 14+ days
//
// Tracks sends in email_log table (requires migration: docs/schema-migration-email-log.sql).
// Safe to run hourly — email_log UNIQUE constraint prevents duplicate sends.
//
// Required env vars: CRON_SECRET, RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
// Optional: RESEND_FROM (default: PricePulse <hello@getpricepulse.com>)

import { createHmac } from 'crypto';

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'PricePulse <hello@getpricepulse.com>';
const APP_URL = process.env.APP_URL || 'https://getpricepulse.com';

// Each email type processes at most this many users per cron run
const BATCH_LIMIT = 20;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  // Check if email_log table exists — if not, log and skip nurture
  const { error: tableCheckErr } = await supabase
    .from('email_log')
    .select('id')
    .limit(1);

  if (tableCheckErr?.code === '42P01') {
    console.warn('[email-nurture] email_log table not found — run migration first');
    return res.status(200).json({
      ok: false,
      message: 'email_log table missing — run docs/schema-migration-email-log.sql in Supabase',
    });
  }

  // Check if nurture_unsubscribed column exists (added by schema-migration-unsubscribe.sql)
  const { data: schemaCheck, error: schemaErr } = await supabase
    .from('subscriptions')
    .select('nurture_unsubscribed')
    .limit(1);

  if (schemaErr?.message?.includes('column') || schemaErr?.message?.includes('nurture_unsubscribed')) {
    console.warn('[email-nurture] Missing nurture_unsubscribed column', schemaErr?.message);
    return res.status(200).json({
      ok: false,
      message: 'Database schema incomplete — nurture_unsubscribed column missing. Run docs/schema-migration-unsubscribe.sql in Supabase SQL editor.',
      details: 'This migration adds the nurture_unsubscribed column to subscriptions table for email compliance.',
    });
  }

  const results = {
    welcome: 0,
    first_monitor_added: 0,
    activation_nudge: 0,
    upgrade_prompt: 0,
    reengagement: 0,
    weekly_digest: 0,
    errors: 0,
  };

  // ── 1. Welcome email ──────────────────────────────────────────────────────
  // Target: users who signed up 1-3 hours ago and haven't received a welcome email.
  // Window is 1-3h to be resilient to cron gaps.
  {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();

    const { data: candidates } = await supabase
      .from('subscriptions')
      .select('user_id')
      .gte('created_at', windowStart)
      .lte('created_at', windowEnd)
      .eq('nurture_unsubscribed', false)
      .limit(BATCH_LIMIT);

    for (const sub of candidates || []) {
      if (await alreadySent(supabase, sub.user_id, 'welcome')) continue;
      const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id);
      const email = authUser?.user?.email;
      if (!email) continue;

      const firstName = nameFromEmail(email);
      const sent = await sendEmail(email, 'Welcome to PricePulse — set up your first monitor', buildWelcomeHtml(firstName, sub.user_id));
      if (sent) {
        await logEmail(supabase, sub.user_id, 'welcome', sent);
        results.welcome++;
      } else {
        results.errors++;
      }
    }
  }

  // ── 2. First monitor added ────────────────────────────────────────────────
  // Target: users who created their FIRST monitor in the last 2 hours.
  // Sends "Your monitor is live!" celebration email.
  {
    const windowStart = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    // Find monitors created recently (the first one for each user)
    const { data: recentMonitors } = await supabase
      .from('monitors')
      .select('user_id, name, created_at')
      .gte('created_at', windowStart)
      .order('created_at', { ascending: true })
      .limit(BATCH_LIMIT * 2);

    const processed = new Set();
    for (const monitor of recentMonitors || []) {
      if (processed.has(monitor.user_id)) continue;
      if (await alreadySent(supabase, monitor.user_id, 'first_monitor_added')) continue;

      // Check this is their FIRST monitor (count must be 1)
      const { count } = await supabase
        .from('monitors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', monitor.user_id);

      if (count !== 1) { processed.add(monitor.user_id); continue; }

      const { data: authUser } = await supabase.auth.admin.getUserById(monitor.user_id);
      const email = authUser?.user?.email;
      if (!email) { processed.add(monitor.user_id); continue; }

      const firstName = nameFromEmail(email);
      const competitorName = monitor.name;
      // Check if user is unsubscribed
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('nurture_unsubscribed')
        .eq('user_id', monitor.user_id)
        .single();
      if (sub?.nurture_unsubscribed) { processed.add(monitor.user_id); continue; }

      const sent = await sendEmail(
        email,
        `Your monitor is live — tracking ${competitorName}`,
        buildFirstMonitorHtml(firstName, competitorName, monitor.user_id)
      );
      if (sent) {
        await logEmail(supabase, monitor.user_id, 'first_monitor_added', sent);
        results.first_monitor_added++;
      } else {
        results.errors++;
      }
      processed.add(monitor.user_id);
      if (results.first_monitor_added >= BATCH_LIMIT) break;
    }
  }

  // ── 4. Activation nudge ───────────────────────────────────────────────────
  // Target: users who signed up 24-48h ago with 0 monitors.
  {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const { data: candidates } = await supabase
      .from('subscriptions')
      .select('user_id')
      .gte('created_at', windowStart)
      .lte('created_at', windowEnd)
      .eq('nurture_unsubscribed', false)
      .limit(BATCH_LIMIT);

    for (const sub of candidates || []) {
      if (await alreadySent(supabase, sub.user_id, 'activation_nudge')) continue;

      // Check monitor count
      const { count: monitorCount } = await supabase
        .from('monitors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', sub.user_id)
        .eq('status', 'active');

      if (monitorCount > 0) continue; // Already activated

      const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id);
      const email = authUser?.user?.email;
      if (!email) continue;

      const firstName = nameFromEmail(email);
      const sent = await sendEmail(email, 'You haven\'t added any monitors yet', buildActivationNudgeHtml(firstName, sub.user_id));
      if (sent) {
        await logEmail(supabase, sub.user_id, 'activation_nudge', sent);
        results.activation_nudge++;
      } else {
        results.errors++;
      }
    }
  }

  // ── 5. Upgrade prompt ─────────────────────────────────────────────────────
  // Target: free users with exactly 2 monitors (at limit) who haven't been prompted.
  {
    const { data: freeUsers } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('plan', 'free')
      .eq('status', 'active')
      .eq('nurture_unsubscribed', false)
      .limit(100); // Process more candidates, filter by monitor count

    const candidates = [];
    for (const sub of freeUsers || []) {
      if (await alreadySent(supabase, sub.user_id, 'upgrade_prompt')) continue;
      const { count } = await supabase
        .from('monitors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', sub.user_id)
        .eq('status', 'active');
      if (count >= 2) candidates.push(sub.user_id);
      if (candidates.length >= BATCH_LIMIT) break;
    }

    for (const userId of candidates) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      const email = authUser?.user?.email;
      if (!email) continue;

      const firstName = nameFromEmail(email);
      const sent = await sendEmail(email, 'Ready to monitor more competitors?', buildUpgradePromptHtml(firstName, userId));
      if (sent) {
        await logEmail(supabase, userId, 'upgrade_prompt', sent);
        results.upgrade_prompt++;
      } else {
        results.errors++;
      }
    }
  }

  // ── 6. Re-engagement ──────────────────────────────────────────────────────
  // Target: users who haven't logged in for 14+ days and haven't been re-engaged.
  {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    // Get users who signed up more than 14 days ago
    const { data: oldUsers } = await supabase
      .from('subscriptions')
      .select('user_id')
      .lte('created_at', cutoff)
      .eq('nurture_unsubscribed', false)
      .limit(100);

    const candidates = [];
    for (const sub of oldUsers || []) {
      if (await alreadySent(supabase, sub.user_id, 'reengagement')) continue;
      const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id);
      const lastSignIn = authUser?.user?.last_sign_in_at;
      // Inactive if never signed in, or last sign in > 14 days ago
      if (!lastSignIn || new Date(lastSignIn) < new Date(cutoff)) {
        candidates.push({ userId: sub.user_id, email: authUser?.user?.email });
      }
      if (candidates.length >= BATCH_LIMIT) break;
    }

    for (const { userId, email } of candidates) {
      if (!email) continue;
      const firstName = nameFromEmail(email);
      const sent = await sendEmail(email, 'Your competitors may have changed their pricing', buildReengagementHtml(firstName, userId));
      if (sent) {
        await logEmail(supabase, userId, 'reengagement', sent);
        results.reengagement++;
      } else {
        results.errors++;
      }
    }
  }

  // ── 7. Weekly pricing digest (Mondays only) ──────────────────────────────
  // Sends a personalized weekly summary of monitoring status to all active users.
  // Uses last_weekly_digest_at column (requires schema-migration-weekly-digest.sql).
  // Safe to skip if column doesn't exist yet — won't block other emails.
  {
    const dayOfWeek = new Date().getDay(); // 0=Sunday, 1=Monday
    if (dayOfWeek === 1) {
      // Check if last_weekly_digest_at column exists
      const { error: weeklyColErr } = await supabase
        .from('subscriptions')
        .select('last_weekly_digest_at')
        .limit(1);

      if (!weeklyColErr?.message?.includes('column') && !weeklyColErr?.message?.includes('last_weekly_digest_at')) {
        const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Find users who haven't received a digest in 6+ days
        const { data: digestCandidates } = await supabase
          .from('subscriptions')
          .select('user_id, plan')
          .or(`last_weekly_digest_at.is.null,last_weekly_digest_at.lt.${sixDaysAgo}`)
          .eq('nurture_unsubscribed', false)
          .limit(BATCH_LIMIT);

        for (const sub of digestCandidates || []) {
          const { data: authUser } = await supabase.auth.admin.getUserById(sub.user_id);
          const email = authUser?.user?.email;
          if (!email) continue;

          // Get user's active monitors
          const { data: monitors } = await supabase
            .from('monitors')
            .select('id, name, url, status')
            .eq('user_id', sub.user_id)
            .eq('status', 'active');

          const monitorCount = monitors?.length || 0;

          // Get alerts from last 7 days for this user's monitors
          let weekAlerts = [];
          if (monitorCount > 0) {
            const monitorIds = monitors.map(m => m.id);
            const { data: alerts } = await supabase
              .from('alerts')
              .select('monitor_id, diff_preview, detected_at, significance')
              .in('monitor_id', monitorIds)
              .eq('status', 'sent')
              .gte('sent_at', sevenDaysAgo)
              .order('detected_at', { ascending: false })
              .limit(10);
            weekAlerts = alerts || [];
          }

          const firstName = nameFromEmail(email);
          const weekStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          const subject = weekAlerts.length > 0
            ? `${weekAlerts.length} pricing change${weekAlerts.length > 1 ? 's' : ''} detected this week`
            : `Your ${monitorCount} competitor${monitorCount !== 1 ? 's' : ''} had no pricing changes this week`;

          const sent = await sendEmail(
            email,
            subject,
            buildWeeklyDigestHtml(firstName, sub.user_id, monitorCount, weekAlerts, monitors || [], weekStr, sub.plan)
          );

          if (sent) {
            // Update last_weekly_digest_at
            await supabase
              .from('subscriptions')
              .update({ last_weekly_digest_at: new Date().toISOString() })
              .eq('user_id', sub.user_id);
            results.weekly_digest++;
          } else {
            results.errors++;
          }
        }
      }
    }
  }

  const total = results.welcome + results.activation_nudge + results.upgrade_prompt + results.reengagement + (results.weekly_digest || 0);
  console.log('[email-nurture] Done:', results);
  return res.status(200).json({ ok: true, sent: total, ...results });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateUnsubscribeLink(userId) {
  // Create an unsubscribe token: userId:timestamp:hmac(userId:timestamp)
  const timestamp = Math.floor(Date.now() / 1000);
  const secret = process.env.CRON_SECRET || 'default-secret';
  const signature = createHmac('sha256', secret)
    .update(`${userId}:${timestamp}`)
    .digest('hex');
  const token = `${userId}:${timestamp}:${signature}`;
  return `${APP_URL}/api/unsubscribe?token=${token}`;
}

async function alreadySent(supabase, userId, emailType) {
  const { data } = await supabase
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', emailType)
    .limit(1);
  return data && data.length > 0;
}

async function logEmail(supabase, userId, emailType, resendId) {
  await supabase
    .from('email_log')
    .insert({ user_id: userId, email_type: emailType, resend_id: resendId })
    .onConflict('user_id,email_type')
    .ignore();
}

async function sendEmail(to, subject, html) {
  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.id || 'sent';
    }
    const err = await res.text();
    console.error('[email-nurture] Resend error:', err.slice(0, 200));
    return null;
  } catch (err) {
    console.error('[email-nurture] Network error:', err.message);
    return null;
  }
}

function nameFromEmail(email) {
  // Extract first name from email prefix: "john.doe@" → "John"
  const prefix = email.split('@')[0];
  const name = prefix.split(/[._-]/)[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ── Email HTML builders ───────────────────────────────────────────────────────

function buildWelcomeHtml(firstName, userId) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#00e5a0,#00b87a);padding:40px;text-align:center">
  <div style="font-size:32px;margin-bottom:8px">📡</div>
  <h1 style="margin:0;font-size:24px;font-weight:700;color:#0a0a0f">Welcome to PricePulse!</h1>
  <p style="margin:8px 0 0;font-size:15px;color:rgba(10,10,15,0.7)">Stop being surprised by competitor pricing changes</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px">Hey ${firstName},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    Thanks for signing up! PricePulse monitors competitor pricing pages 24/7 so you don't have to.
  </p>

  <div style="background:#f0fdf4;border-left:4px solid #00e5a0;border-radius:4px;padding:16px 20px;margin:0 0 28px">
    <p style="margin:0;font-size:14px;font-weight:600;color:#065f46">Your next step: add your first monitor</p>
    <p style="margin:6px 0 0;font-size:14px;color:#047857;line-height:1.5">
      Head to your dashboard and paste any competitor's pricing page URL. PricePulse starts checking it immediately.
    </p>
  </div>

  <!-- Steps -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
    ${buildStep('1', 'Add a competitor URL', 'Go to dashboard → "Add Monitor" → paste their pricing page')}
    ${buildStep('2', 'Get your first alert', 'When they change prices, you get an email with the exact before/after diff')}
    ${buildStep('3', 'Act on intelligence', 'Respond before your customers even notice the change')}
  </table>

  <a href="${APP_URL}/dashboard.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 28px">
    Go to Dashboard →
  </a>

  <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 24px">
    On the free plan, you can monitor 2 competitors. Need more? <a href="${APP_URL}/pricing.html" style="color:#00b87a">Upgrade anytime</a>.
  </p>

  <p style="font-size:14px;color:#374151;line-height:1.6;margin:0">
    One thing to set expectations: you won't hear from the product until a competitor actually changes their pricing. That might be tomorrow, or it might be in three weeks — depends on your competitors. But when it happens, you'll know immediately instead of finding out months later.<br><br>
    If you have any questions or feedback (especially if something doesn't work), reply to this email. I read everything.<br><br>
    — the founder
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
    You're receiving this because you signed up for PricePulse.<br>
    Questions? Reply to this email — I read every one.<br>
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe from nurture emails</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildFirstMonitorHtml(firstName, competitorName, userId) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<tr><td style="background:linear-gradient(135deg,#00e5a0,#00b87a);padding:40px;text-align:center">
  <div style="font-size:40px;margin-bottom:12px">🎉</div>
  <h1 style="margin:0;font-size:24px;font-weight:700;color:#0a0a0f">Your monitor is live!</h1>
  <p style="margin:8px 0 0;font-size:15px;color:rgba(10,10,15,0.75)">You're now tracking ${escForHtml(competitorName)}</p>
</td></tr>

<tr><td style="padding:40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px">Hey ${firstName},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    PricePulse is now checking <strong>${escForHtml(competitorName)}</strong> for pricing changes.
    We'll email you the moment anything changes — usually within the hour.
  </p>

  <!-- What we check -->
  <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:0 0 24px">
    <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#065f46">What we're watching for:</p>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${buildCheckItem('Price changes', 'Any plan price going up or down')}
      ${buildCheckItem('Plan restructuring', 'New plans added, old plans removed')}
      ${buildCheckItem('Feature changes', 'What\'s included in each tier')}
      ${buildCheckItem('Copy changes', 'Value proposition and messaging shifts')}
    </table>
  </div>

  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px 20px;margin:0 0 24px">
    <p style="margin:0;font-size:14px;color:#92400e;line-height:1.5">
      <strong>Pro tip:</strong> Add 2-3 more competitors while you're here. Monitoring a cluster of
      competitors gives you a complete picture of how the market is moving.
    </p>
  </div>

  <a href="${APP_URL}/dashboard.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 16px">
    Add More Competitors →
  </a>

  <p style="font-size:13px;color:#6b7280;text-align:center;margin:0">
    Free plan: 2 monitors. <a href="${APP_URL}/pricing.html" style="color:#00b87a">Upgrade for 10+</a>
  </p>
</td></tr>

<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="${APP_URL}" style="color:#9ca3af">getpricepulse.com</a> ·
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildActivationNudgeHtml(firstName, userId) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<!-- Header -->
<tr><td style="background:#0a0a0f;padding:32px 40px">
  <div style="font-size:20px;font-weight:700;color:#00e5a0">PricePulse</div>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px">Hey ${firstName},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">
    You signed up for PricePulse yesterday but haven't added any monitors yet.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 28px">
    It takes 30 seconds: just paste a competitor's pricing page URL and we handle the rest.
  </p>

  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:0 0 28px">
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#9a3412">Why this matters right now</p>
    <p style="margin:0;font-size:14px;color:#7c2d12;line-height:1.6">
      SaaS companies quietly change their prices all the time — often without announcements.
      In Q1 2026, 34% of SaaS pricing pages changed at least once.
      Without monitoring, you'd never know until a customer told you.
    </p>
  </div>

  <a href="${APP_URL}/first-monitor.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 24px">
    Add Your First Monitor →
  </a>

  <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
    Free plan includes 2 monitors with daily checks. No credit card required.
  </p>

  <p style="font-size:14px;color:#374151;line-height:1.6;margin:0">
    If you ran into any friction signing up or the product isn't doing what you expected, reply to this email and tell me. I'm actively fixing things.<br><br>
    — the founder
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="${APP_URL}" style="color:#9ca3af">getpricepulse.com</a> ·
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildUpgradePromptHtml(firstName, userId) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#00e5a0,#00b87a);padding:32px 40px">
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#0a0a0f">Ready to monitor more competitors?</h1>
  <p style="margin:8px 0 0;font-size:14px;color:rgba(10,10,15,0.7)">You've hit your free plan limit — good sign!</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px">Hey ${firstName},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">
    You've maxed out your 2 monitors on the free plan. That means PricePulse is working for you.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 28px">
    Upgrade to Starter for $19/month and monitor up to 10 competitors with hourly checks.
  </p>

  <!-- Plan comparison -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
    <tr style="background:#f9fafb">
      <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase">Feature</td>
      <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#6b7280;text-align:center">Free</td>
      <td style="padding:12px 16px;font-size:12px;font-weight:600;color:#00b87a;text-align:center">Starter</td>
    </tr>
    ${buildCompareRow('Monitors', '2', '10')}
    ${buildCompareRow('Check frequency', 'Daily', 'Hourly')}
    ${buildCompareRow('Price', '$0', '$19/mo')}
    ${buildCompareRow('Cost per competitor', '—', '$1.90/mo')}
  </table>

  <a href="${APP_URL}/plan-select.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 16px">
    Upgrade to Starter — $19/month →
  </a>

  <p style="font-size:13px;color:#6b7280;text-align:center;margin:0">
    Cancel anytime · No long-term commitment
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="${APP_URL}" style="color:#9ca3af">getpricepulse.com</a> ·
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildReengagementHtml(firstName, userId) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<!-- Header -->
<tr><td style="background:#0a0a0f;padding:32px 40px">
  <div style="font-size:20px;font-weight:700;color:#00e5a0">PricePulse</div>
</td></tr>

<!-- Body -->
<tr><td style="padding:40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px">Hey ${firstName},</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px">
    We noticed you haven't checked your competitive intelligence dashboard in a while.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    In the time since your last visit, your competitors may have updated their pricing.
    34% of SaaS pricing pages change at least once per quarter — and the best founders know within hours, not months.
  </p>

  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:0 0 28px">
    <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#065f46">What you may have missed</p>
    <ul style="margin:0;padding-left:20px;font-size:14px;color:#047857;line-height:2">
      <li>Competitors quietly raising prices (without announcements)</li>
      <li>New plan tiers being tested and launched</li>
      <li>Free plans being restricted or eliminated</li>
      <li>Pricing page copy changes that signal strategic shifts</li>
    </ul>
  </div>

  <a href="${APP_URL}/dashboard.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 24px">
    Check Your Dashboard →
  </a>

  <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0">
    If PricePulse isn't working for you, just reply to this email.
    We'd love to know what to improve.
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="${APP_URL}" style="color:#9ca3af">getpricepulse.com</a> ·
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Email sub-component builders ──────────────────────────────────────────────

function escForHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildCheckItem(title, desc) {
  return `
    <tr>
      <td style="padding:4px 0;vertical-align:top;width:20px">
        <span style="color:#00b87a;font-size:14px;font-weight:700">✓</span>
      </td>
      <td style="padding:4px 0 4px 8px">
        <span style="font-size:14px;color:#065f46;font-weight:600">${title}</span>
        <span style="font-size:13px;color:#047857;margin-left:6px">${desc}</span>
      </td>
    </tr>
  `;
}

function buildStep(num, title, desc) {
  return `
    <tr>
      <td style="padding:0 0 16px;vertical-align:top">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="40" style="vertical-align:top;padding-top:2px">
              <div style="width:28px;height:28px;background:#00e5a0;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:700;color:#0a0a0f">${num}</div>
            </td>
            <td>
              <div style="font-size:15px;font-weight:600;color:#1a1a2e;margin-bottom:4px">${title}</div>
              <div style="font-size:14px;color:#6b7280;line-height:1.5">${desc}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function buildCompareRow(feature, freeVal, starterVal) {
  return `
    <tr style="border-top:1px solid #e5e7eb">
      <td style="padding:10px 16px;font-size:14px;color:#374151">${feature}</td>
      <td style="padding:10px 16px;font-size:14px;color:#6b7280;text-align:center">${freeVal}</td>
      <td style="padding:10px 16px;font-size:14px;color:#00b87a;font-weight:600;text-align:center">${starterVal}</td>
    </tr>
  `;
}

function escForHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildWeeklyDigestHtml(firstName, userId, monitorCount, weekAlerts, monitors, weekStr, plan) {
  const unsubscribeLink = generateUnsubscribeLink(userId);
  const hasAlerts = weekAlerts.length > 0;
  const headerBg = hasAlerts
    ? 'background:linear-gradient(135deg,#4f6ef7,#7c3aed)'
    : 'background:linear-gradient(135deg,#00e5a0,#00b87a)';
  const headerIcon = hasAlerts ? '⚡' : '📡';
  const headerTitle = hasAlerts
    ? `${weekAlerts.length} pricing change${weekAlerts.length > 1 ? 's' : ''} detected this week`
    : 'All quiet this week';
  const headerSub = hasAlerts
    ? `Here's what changed among your monitored competitors`
    : `Your ${monitorCount} competitor${monitorCount !== 1 ? 's' : ''} held their pricing steady`;

  // Build alert rows
  const alertRows = weekAlerts.slice(0, 5).map(alert => {
    const monitor = monitors.find(m => m.id === alert.monitor_id);
    const monitorName = monitor ? escForHtml(monitor.name) : 'Competitor';
    const detected = new Date(alert.detected_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const diffText = alert.diff_preview
      ? escForHtml(alert.diff_preview).slice(0, 200)
      : 'Pricing page content changed';
    return `
    <div style="background:#f8f9ff;border-left:3px solid #4f6ef7;border-radius:4px;padding:14px 16px;margin:0 0 12px">
      <div style="font-size:13px;font-weight:600;color:#4f6ef7;margin-bottom:4px">${monitorName}</div>
      <div style="font-size:13px;color:#374151;line-height:1.5;white-space:pre-wrap">${diffText}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:6px">Detected ${detected}</div>
    </div>`;
  }).join('');

  // Build monitor list (when no alerts)
  const monitorList = monitors.slice(0, 6).map(m =>
    `<tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00e5a0;margin-right:8px"></span>
      ${escForHtml(m.name)}
    </td></tr>`
  ).join('');

  // Upgrade nudge for free users
  const upgradeSection = plan === 'free' ? `
  <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px 20px;margin:0 0 24px">
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#92400e">Want hourly checks instead of daily?</p>
    <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5">
      Upgrade to Starter for $19/month to monitor 10 competitors with hourly checks.
      <a href="${APP_URL}/plan-select.html" style="color:#d97706;text-decoration:underline">Upgrade now →</a>
    </p>
  </div>` : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<!-- Header -->
<tr><td style="${headerBg};padding:32px 40px">
  <div style="font-size:28px;margin-bottom:8px">${headerIcon}</div>
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff">${headerTitle}</h1>
  <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.8)">Week of ${weekStr} · PricePulse weekly digest</p>
</td></tr>

<!-- Sub-header -->
<tr><td style="background:#fafafa;padding:16px 40px;border-bottom:1px solid #e5e7eb">
  <p style="margin:0;font-size:14px;color:#6b7280">${headerSub}</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px 40px">
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px">Hey ${firstName},</p>

  ${hasAlerts ? `
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">
    PricePulse detected ${weekAlerts.length} pricing change${weekAlerts.length > 1 ? 's' : ''} among your monitored competitors this week.
    Here's a summary:
  </p>
  ${alertRows}
  <a href="${APP_URL}/dashboard.html"
     style="display:block;background:#4f6ef7;color:#fff;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:20px 0 28px">
    View full alert details →
  </a>
  ` : `
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">
    Good news: none of your monitored competitors changed their pricing this week.
    PricePulse is watching — you'll hear from us the moment something changes.
  </p>

  ${monitorCount > 0 ? `
  <div style="margin:0 0 24px">
    <p style="font-size:14px;font-weight:600;color:#374151;margin:0 0 10px">Currently monitoring (${monitorCount}):</p>
    <table width="100%" cellpadding="0" cellspacing="0">${monitorList}</table>
  </div>
  ` : `
  <div style="background:#f0fdf4;border-left:4px solid #00e5a0;border-radius:4px;padding:14px 16px;margin:0 0 24px">
    <p style="margin:0;font-size:14px;font-weight:600;color:#065f46">You haven't added any competitors yet.</p>
    <p style="margin:6px 0 0;font-size:13px;color:#047857">
      Add your first competitor's pricing page and PricePulse will alert you the moment anything changes.
    </p>
  </div>
  `}

  <a href="${APP_URL}/dashboard.html"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 24px">
    ${monitorCount === 0 ? 'Add your first competitor →' : 'View your dashboard →'}
  </a>
  `}

  ${upgradeSection}

  <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0">
    This is your weekly digest from PricePulse. You'll get one every Monday.
    If you spot anything off or have feedback, reply to this email — I read everything.
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="${APP_URL}" style="color:#9ca3af">getpricepulse.com</a> ·
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe from digest emails</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
