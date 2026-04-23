/**
 * GET /api/unsubscribe?token={token}&type={type}
 *
 * One-click unsubscribe from emails.
 * Token can be:
 *   1. Simple unsubscribe token (format: userId:timestamp:signature)
 *      where signature = HMAC-SHA256(userId:timestamp, CRON_SECRET)
 *   2. JWT (user's auth token, encoded as URL-safe base64)
 *
 * type parameter (optional, defaults to 'nurture'):
 *   - 'nurture': unsubscribe from marketing/nurture emails only
 *   - 'alerts': unsubscribe from price alert emails only
 *   - 'all': unsubscribe from both
 *
 * Returns: HTML page confirming unsubscribe (200 OK) or error (400/401)
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.query.token;
  if (!token) {
    return res.status(400).send(errorPage('Invalid unsubscribe link', 'This link is missing a token.'));
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { createHmac } = await import('crypto');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );

    let userId;

    // Check if token is a simple unsubscribe token (format: userId:timestamp:signature)
    if (token.includes(':')) {
      const parts = token.split(':');
      if (parts.length === 3) {
        const [tokenUserId, timestamp, signature] = parts;

        // Verify the signature using HMAC
        const secret = process.env.CRON_SECRET || 'default-secret';
        const expectedSignature = createHmac('sha256', secret)
          .update(`${tokenUserId}:${timestamp}`)
          .digest('hex');

        // Check signature matches
        if (signature !== expectedSignature) {
          return res.status(401).send(errorPage('Invalid unsubscribe link', 'This link has expired or is invalid.'));
        }

        userId = tokenUserId;
      } else {
        return res.status(400).send(errorPage('Invalid unsubscribe link', 'This link is malformed.'));
      }
    } else {
      // Try JWT token (decoded from base64)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const jwtToken = decodeURIComponent(decoded);
        const { data: { user }, error: authError } = await supabase.auth.getUser(jwtToken);
        if (authError || !user) {
          return res.status(401).send(errorPage('Invalid unsubscribe link', 'This link has expired.'));
        }
        userId = user.id;
      } catch (err) {
        return res.status(400).send(errorPage('Invalid unsubscribe link', 'This link is invalid.'));
      }
    }

    if (!userId) {
      return res.status(400).send(errorPage('Invalid unsubscribe link', 'Could not process unsubscribe.'));
    }

    // Determine which email types to unsubscribe from
    const type = req.query.type || 'nurture';
    const updateData = {};

    if (type === 'nurture' || type === 'all') {
      updateData.nurture_unsubscribed = true;
    }
    if (type === 'alerts' || type === 'all') {
      updateData.alerts_unsubscribed = true;
    }

    // Mark user as unsubscribed
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Unsubscribe update error:', updateError);
      return res.status(500).send(errorPage('Error unsubscribing', 'Something went wrong. Please try again.'));
    }

    // Generate appropriate success message based on type
    let title = 'Unsubscribed';
    let message = '';
    if (type === 'nurture') {
      message = `
        <p class="success">You've been unsubscribed from PricePulse nurture emails.</p>
        <div class="info">
          <p>You'll no longer receive welcome, activation, upgrade, or re-engagement emails. You'll still get:</p>
          <p style="font-size: 14px; margin-top: 8px;">✓ Price change alerts for your monitors<br>✓ Account/billing notifications</p>
          <p style="font-size: 14px; margin-top: 16px;">Questions? Email hello@getpricepulse.com</p>
        </div>
      `;
    } else if (type === 'alerts') {
      message = `
        <p class="success">You've been unsubscribed from PricePulse alert emails.</p>
        <div class="info">
          <p>You'll no longer receive price change alerts. You'll still get:</p>
          <p style="font-size: 14px; margin-top: 8px;">✓ Marketing and engagement emails<br>✓ Account/billing notifications</p>
          <p style="font-size: 14px; margin-top: 16px;">You can still view alerts in your dashboard. Questions? Email hello@getpricepulse.com</p>
        </div>
      `;
    } else if (type === 'all') {
      message = `
        <p class="success">You've been unsubscribed from all PricePulse emails.</p>
        <div class="info">
          <p>You'll no longer receive price alerts, nurture emails, or other communications. You can resubscribe anytime from your account settings.</p>
          <p style="font-size: 14px; margin-top: 16px;">Questions? Email hello@getpricepulse.com</p>
        </div>
      `;
    }

    // Success response
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Unsubscribed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 40px; background: #f4f4f5; }
          .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; text-align: center; }
          h1 { font-size: 24px; margin: 0 0 16px; color: #0a0a0f; }
          p { font-size: 15px; color: #6b7280; margin: 0; line-height: 1.6; }
          .success { color: #059669; font-weight: 600; }
          .info { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${title}</h1>
          ${message}
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.status(500).send(errorPage('Error unsubscribing', 'Something went wrong. Please contact support.'));
  }
}

function errorPage(title, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Unsubscribe</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 40px; background: #f4f4f5; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; text-align: center; }
        h1 { font-size: 24px; margin: 0 0 16px; color: #0a0a0f; }
        p { font-size: 15px; color: #6b7280; margin: 0; line-height: 1.6; }
        .error { color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p class="error">${message} Please contact support at hello@getpricepulse.com.</p>
      </div>
    </body>
    </html>
  `;
}
