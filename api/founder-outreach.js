// api/founder-outreach.js — Founder outreach campaign via email
// POST /api/founder-outreach { secret: string }
// Secured with CRON_SECRET (same as email-nurture)
//
// Sends 5 personalized outreach emails to pre-researched indie SaaS founders
// offering free 3-month Starter plans in exchange for feedback.
//
// Required env vars: CRON_SECRET, RESEND_API_KEY, RESEND_FROM

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_ADDRESS = process.env.RESEND_FROM || 'Race <race@getpricepulse.com>';

// Pre-researched founders with contact info
const FOUNDERS = [
  {
    name: 'Marc Lou',
    email: 'marc@trustmrr.com',
    tool: 'TrustMRR',
    competitors: 'Baremetrics, Claap, ProfitWell',
    personalNote: 'I noticed you\'ve built a metrics dashboard that founders love — monitoring competitor pricing changes would give your users real competitive intelligence.'
  },
  {
    name: 'Loki.Build Team',
    email: 'hello@loki.build',
    tool: 'Loki.Build',
    competitors: 'Relume, Webflow, Framer',
    personalNote: 'Your AI landing page builder is impressive. Monitoring pricing changes from competitors like Webflow would inform your positioning strategy.'
  },
  {
    name: 'Flux Team',
    email: 'contact@flux.build',
    tool: 'Flux',
    competitors: 'Zapier, Make, Integromat',
    personalNote: 'Your AI agents platform is innovative. Tracking pricing from automation tools you integrate with would help you stay competitive.'
  },
  {
    name: 'Spyglass Founder',
    email: 'hello@spyglassci.com',
    tool: 'Spyglass',
    competitors: 'Panoramix, Kompyte, Contentsquare',
    personalNote: 'Since you track competitor intelligence, using PricePulse would help you benchmark your own positioning against competitive intelligence platforms.'
  },
  {
    name: 'Scholé AI Team',
    email: 'contact@scholé.ai',
    tool: 'Scholé AI',
    competitors: 'Coursera, Skillsoft, LinkedIn Learning',
    personalNote: 'Your enterprise learning platform is impressive. Monitoring pricing from competitors in the learning space would inform your enterprise sales strategy.'
  }
];

async function sendFounderEmail(founder) {
  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <p>Hi ${founder.name},</p>

  <p>I've been following ${founder.tool} — ${founder.personalNote}</p>

  <p>I build <strong>PricePulse</strong> (getpricepulse.com), a tool that monitors SaaS pricing changes for competitive intelligence. We track 140+ tools and help founders see when competitors raise prices before customers do.</p>

  <p>Thought you might find it useful to monitor ${founder.competitors} as you scale. We offer free pricing alerts to indie founders.</p>

  <div style="background: #f3f4f6; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-weight: 600;">Free offer:</p>
    <p style="margin: 8px 0 0 0;">3-month Starter plan (normally $99/mo) if you're open to a 15-min call sharing feedback on what you'd need in a pricing intelligence tool. No obligation.</p>
  </div>

  <p>Interested?</p>

  <p>— Race<br/>
  <strong>PricePulse</strong><br/>
  <a href="https://getpricepulse.com">getpricepulse.com</a></p>
</div>
`;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: founder.email,
        subject: `Free SaaS pricing monitoring for ${founder.tool}?`,
        html: htmlBody
      })
    });

    const result = await response.json();

    if (response.ok) {
      return {
        founder: founder.name,
        email: founder.email,
        tool: founder.tool,
        status: 'sent',
        id: result.id,
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        founder: founder.name,
        email: founder.email,
        tool: founder.tool,
        status: 'failed',
        error: result.message,
        timestamp: new Date().toISOString()
      };
    }
  } catch (err) {
    return {
      founder: founder.name,
      email: founder.email,
      tool: founder.tool,
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.body || {};
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'RESEND_API_KEY not configured' });
  }

  try {
    console.log('[founder-outreach] Starting campaign...');

    const results = [];
    for (const founder of FOUNDERS) {
      const result = await sendFounderEmail(founder);
      results.push(result);
      // Small delay between sends
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status !== 'sent').length;

    console.log(`[founder-outreach] Campaign complete: ${sent} sent, ${failed} failed`);

    return res.status(200).json({
      ok: true,
      message: `Founder outreach campaign: ${sent}/5 emails sent`,
      summary: {
        total: results.length,
        sent: sent,
        failed: failed
      },
      results: results
    });
  } catch (err) {
    console.error('[founder-outreach] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Campaign failed: ' + err.message });
  }
}
