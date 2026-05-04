// api/confirm-price-alert.js — Email confirmation endpoint for price alerts
// GET /api/confirm-price-alert?token=base64(uuid:email)
//
// When user clicks confirmation link in email, this endpoint:
// 1. Validates the token
// 2. Updates price_alerts status from 'new' to 'confirmed'
// 3. Returns success page or redirects to dashboard

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing confirmation token' });
  }

  try {
    // Decode token: base64(uuid:email)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [id, email] = decoded.split(':');

    if (!id || !email) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );

    // Update subscription status to 'confirmed'
    const { error: updateErr } = await supabase
      .from('price_alerts')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', id)
      .eq('email', email);

    if (updateErr) {
      console.error('Failed to confirm email:', updateErr);
      return res.status(400).json({ error: 'Unable to confirm email. Link may have expired.' });
    }

    // Redirect to success page or dashboard
    // For now, return success JSON (frontend can handle)
    return res.status(200).json({
      ok: true,
      message: 'Email confirmed! You\'ll now receive price alerts.',
    });

  } catch (err) {
    console.error('Confirmation error:', err);
    return res.status(500).json({ error: 'Server error during confirmation' });
  }
}
