// api/feedback.js — Feedback collection for Week 1 launch
// POST /api/feedback — Submit user feedback with structured data

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { category, satisfaction, message, email, company, followup, pricing_issues, top_feature, submitted_at } = req.body;

  // Validate required fields
  if (!category || !satisfaction || !message || !email || !followup) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Feedback must be at least 10 characters' });
  }

  // If Supabase is not configured, log to console
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.log('[FEEDBACK]', {
      timestamp: new Date().toISOString(),
      category,
      satisfaction,
      email,
      company,
      message: message.substring(0, 100),
      pricing_issues,
      top_feature,
    });

    // Email the feedback to hello@getpricepulse.com via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const feedbackSummary = `
Category: ${category}
Satisfaction: ${satisfaction}/4
Email: ${email}
Company: ${company || 'Not provided'}
Follow-up: ${followup}
${pricing_issues?.length > 0 ? `\nPricing issues: ${pricing_issues.join(', ')}` : ''}
${top_feature ? `\nTop feature wanted: ${top_feature}` : ''}

Message:
${message}

Submitted: ${submitted_at}
        `.trim();

        await resend.emails.send({
          from: 'noreply@getpricepulse.com',
          to: 'hello@getpricepulse.com',
          subject: `[Feedback] ${category} from ${email}`,
          text: feedbackSummary,
        });
      } catch (emailErr) {
        console.error('[FEEDBACK] Email send failed:', emailErr.message);
        // Don't fail the API call if email fails
      }
    }

    return res.status(201).json({ success: true, message: 'Feedback received' });
  }

  // If Supabase is configured, store in database
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );

    // Check if feedback table exists, if not use email to send
    const { data: existingData, error: checkError } = await supabase
      .from('feedback')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (checkError?.code === 'PGRST116') {
      // Table doesn't exist, send via email instead
      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const feedbackSummary = `
Category: ${category}
Satisfaction: ${satisfaction}/4
Email: ${email}
Company: ${company || 'Not provided'}
Follow-up: ${followup}
${pricing_issues?.length > 0 ? `\nPricing issues: ${pricing_issues.join(', ')}` : ''}
${top_feature ? `\nTop feature wanted: ${top_feature}` : ''}

Message:
${message}

Submitted: ${submitted_at}
        `.trim();

        await resend.emails.send({
          from: 'noreply@getpricepulse.com',
          to: 'hello@getpricepulse.com',
          subject: `[Feedback] ${category} from ${email}`,
          text: feedbackSummary,
        });
      }

      return res.status(201).json({ success: true, message: 'Feedback received' });
    }

    // Insert into database
    const { error: insertError } = await supabase
      .from('feedback')
      .insert({
        category,
        satisfaction: parseInt(satisfaction),
        message,
        email,
        company: company || null,
        followup,
        pricing_issues: pricing_issues || [],
        top_feature: top_feature || null,
        submitted_at,
      });

    if (insertError) {
      console.error('[FEEDBACK] Insert error:', insertError);
      throw insertError;
    }

    // Email confirmation to hello@
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const feedbackSummary = `
Category: ${category}
Satisfaction: ${satisfaction}/4
Email: ${email}
Company: ${company || 'Not provided'}
Follow-up: ${followup}
${pricing_issues?.length > 0 ? `\nPricing issues: ${pricing_issues.join(', ')}` : ''}
${top_feature ? `\nTop feature wanted: ${top_feature}` : ''}

Message:
${message}

Submitted: ${submitted_at}
        `.trim();

        await resend.emails.send({
          from: 'noreply@getpricepulse.com',
          to: 'hello@getpricepulse.com',
          subject: `[Feedback] ${category} from ${email}`,
          text: feedbackSummary,
        });
      } catch (emailErr) {
        console.error('[FEEDBACK] Email send failed:', emailErr.message);
        // Don't fail if email doesn't work
      }
    }

    return res.status(201).json({ success: true, message: 'Feedback received' });

  } catch (err) {
    console.error('[FEEDBACK] Error:', err);
    return res.status(500).json({ error: 'Failed to process feedback' });
  }
}
