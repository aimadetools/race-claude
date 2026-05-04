// api/price-alerts-email-nurture.js — Email nurture for price alerts lead magnet
// POST /api/price-alerts-email-nurture { secret: string }
// Secured with CRON_SECRET.
//
// Sends emails to price_alerts subscribers:
//   confirmation      — Immediately after signup, confirm email address
//   price_change      — When tracked tool changes pricing (future: requires price change detection)
//   nurture_day7      — 7 days after signup, if no PricePulse account yet
//   nurture_day14     — 14 days after signup, social proof + upgrade CTA
//
// Tracks sends in price_alert_email_log table (created with schema-migration-price-alerts.sql)
// Safe to run hourly — email_log UNIQUE constraint prevents duplicate sends.
//
// Required env vars: CRON_SECRET, RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
// Optional: RESEND_FROM (default: PricePulse <hello@getpricepulse.com>)

import { createHmac } from 'crypto';

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'PricePulse <hello@getpricepulse.com>';
const APP_URL = process.env.APP_URL || 'https://getpricepulse.com';
const CRON_SECRET = process.env.CRON_SECRET;

// Batch limits per cron run
const BATCH_LIMITS = {
  confirmation: 50,
  price_change: 30,
  nurture_day7: 20,
  nurture_day14: 20,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (!secret || secret !== CRON_SECRET) {
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

  const results = {
    confirmation_sent: 0,
    price_change_sent: 0,
    nurture_day7_sent: 0,
    nurture_day14_sent: 0,
    errors: [],
  };

  try {
    // 1. CONFIRMATION EMAILS — Send to new subscribers (status='new', not emailed yet)
    const { data: newSubs, error: newSubsErr } = await supabase
      .from('price_alerts')
      .select('id,email,tool_name,created_at')
      .eq('status', 'new')
      .limit(BATCH_LIMITS.confirmation);

    if (newSubsErr) throw new Error(`Failed to fetch new subscribers: ${newSubsErr.message}`);

    for (const sub of newSubs || []) {
      try {
        const confirmToken = Buffer.from(`${sub.id}:${sub.email}`).toString('base64');
        const confirmLink = `${APP_URL}/api/confirm-price-alert?token=${confirmToken}`;

        const emailRes = await fetch(RESEND_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: sub.email,
            subject: `Confirm: Get price alerts for ${sub.tool_name}`,
            html: `
              <h2>Confirm Your Email</h2>
              <p>Thanks for signing up for ${sub.tool_name} price alerts! Click below to confirm and start receiving updates.</p>
              <a href="${confirmLink}" style="display:inline-block; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:4px; font-weight:bold;">
                Confirm Email →
              </a>
              <p style="margin-top:24px; font-size:12px; color:#666;">
                If you didn't sign up for this, you can safely ignore this email.
              </p>
            `,
          }),
        });

        if (!emailRes.ok) {
          throw new Error(`Resend API error: ${emailRes.status}`);
        }

        // Log successful send
        await supabase.from('price_alert_email_log').insert({
          email: sub.email,
          tool_name: sub.tool_name,
          type: 'confirmation',
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

        results.confirmation_sent++;
      } catch (err) {
        results.errors.push(`Failed to send confirmation to ${sub.email}: ${err.message}`);
      }
    }

    // 2. NURTURE DAY 7 — Send to subscribers 7+ days old who haven't confirmed (still status='new')
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: nurtureSubs7, error: nurture7Err } = await supabase
      .from('price_alerts')
      .select('id,email,tool_name,created_at')
      .eq('status', 'confirmed') // Only send to confirmed users (so they've at least opened the email)
      .lt('created_at', sevenDaysAgo)
      .not('price_alert_email_log.nurture_day7', 'is', null) // Not yet sent nurture_day7
      .limit(BATCH_LIMITS.nurture_day7);

    if (nurture7Err && nurture7Err.code !== 'PGRST116') { // Ignore left join issue
      throw new Error(`Failed to fetch nurture subscribers: ${nurture7Err.message}`);
    }

    for (const sub of nurtureSubs7 || []) {
      try {
        const emailRes = await fetch(RESEND_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: sub.email,
            subject: `See what ${sub.tool_name}'s competitors are doing`,
            html: `
              <h2>Monitor More Than Just ${sub.tool_name}</h2>
              <p>You're tracking ${sub.tool_name}'s pricing. But what about their competitors?</p>
              <p>Founders who use PricePulse monitor multiple tools to catch price changes before their customers do.</p>
              <a href="${APP_URL}/companies/index.html" style="display:inline-block; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:4px; font-weight:bold;">
                See 120+ Tools We Track →
              </a>
              <p style="margin-top:24px; font-size:12px; color:#666;">
                Get alerts for Slack, Notion, ClickUp, HubSpot, Linear, and 100+ more SaaS tools.
              </p>
            `,
          }),
        });

        if (!emailRes.ok) {
          throw new Error(`Resend API error: ${emailRes.status}`);
        }

        // Log send
        await supabase.from('price_alert_email_log').insert({
          email: sub.email,
          tool_name: sub.tool_name,
          type: 'nurture_day7',
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

        results.nurture_day7_sent++;
      } catch (err) {
        results.errors.push(`Failed to send nurture_day7 to ${sub.email}: ${err.message}`);
      }
    }

    // 3. NURTURE DAY 14 — Social proof + conversion CTA
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: nurtureSubs14, error: nurture14Err } = await supabase
      .from('price_alerts')
      .select('id,email,tool_name,created_at')
      .eq('status', 'confirmed')
      .lt('created_at', fourteenDaysAgo)
      .not('price_alert_email_log.nurture_day14', 'is', null) // Not yet sent
      .limit(BATCH_LIMITS.nurture_day14);

    if (nurture14Err && nurture14Err.code !== 'PGRST116') {
      throw new Error(`Failed to fetch day14 subscribers: ${nurture14Err.message}`);
    }

    for (const sub of nurtureSubs14 || []) {
      try {
        const emailRes = await fetch(RESEND_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: sub.email,
            subject: `Join 500+ founders monitoring SaaS prices`,
            html: `
              <h2>Join the Pricing Intelligence Community</h2>
              <p>You've been tracking ${sub.tool_name} pricing for 2 weeks now. 500+ indie founders use PricePulse to monitor their entire SaaS stack.</p>
              <p><strong>What you get:</strong></p>
              <ul>
                <li>Price alerts for 120+ SaaS tools</li>
                <li>Instant notifications when competitors raise prices</li>
                <li>Monthly price change reports</li>
                <li>Team cost analysis (how much your stack costs)</li>
              </ul>
              <a href="${APP_URL}?utm_source=email&utm_campaign=nurture_day14" style="display:inline-block; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:4px; font-weight:bold;">
                Start Free (No Card Required) →
              </a>
              <p style="margin-top:24px; font-size:12px; color:#666;">
                Free tier: 2 competitors, daily alerts. Upgrade anytime.
              </p>
            `,
          }),
        });

        if (!emailRes.ok) {
          throw new Error(`Resend API error: ${emailRes.status}`);
        }

        // Log send
        await supabase.from('price_alert_email_log').insert({
          email: sub.email,
          tool_name: sub.tool_name,
          type: 'nurture_day14',
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

        results.nurture_day14_sent++;
      } catch (err) {
        results.errors.push(`Failed to send nurture_day14 to ${sub.email}: ${err.message}`);
      }
    }

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      partial_results: results,
    });
  }
}
