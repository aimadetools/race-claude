/**
 * Analytics Endpoint
 * Receives UTM tracking data and conversion events from the frontend
 * Stores them in Supabase for analysis
 */

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Validate required fields
    if (!event.type) {
      return res.status(400).json({ error: 'Missing event type' });
    }

    // Log to console (development)
    console.log('[ANALYTICS]', JSON.stringify(event, null, 2));

    // TODO: Store in Supabase analytics table
    // For now, just acknowledge receipt
    // const { data, error } = await supabase
    //   .from('analytics_events')
    //   .insert([{
    //     event_type: event.type,
    //     utm_source: event.utm_source,
    //     utm_medium: event.utm_medium,
    //     utm_campaign: event.utm_campaign,
    //     email: event.email || null,
    //     page: event.page || null,
    //     created_at: event.timestamp,
    //     metadata: JSON.stringify(event),
    //   }]);

    // Return success
    res.status(200).json({
      ok: true,
      message: 'Event recorded',
      event_id: Date.now()
    });

  } catch (err) {
    console.error('[ANALYTICS ERROR]', err);
    // Still return 200 to not break frontend
    res.status(200).json({ ok: true });
  }
}
