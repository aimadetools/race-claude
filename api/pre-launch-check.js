// api/pre-launch-check.js — Comprehensive pre-launch verification
// GET /api/pre-launch-check — Returns detailed status of all critical systems
// No auth required (diagnostic tool for launch verification)

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const checks = {
    timestamp: new Date().toISOString(),
    environment: {},
    database: {},
    email: {},
    payment: {},
    api: {},
    overall: 'UNKNOWN',
  };

  try {
    // ────────────────────────────────────────────────────────────
    // 1. ENVIRONMENT VARIABLES
    // ────────────────────────────────────────────────────────────
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_KEY',
      'CRON_SECRET',
      'RESEND_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'APP_URL',
    ];

    for (const envVar of requiredEnvVars) {
      checks.environment[envVar] = {
        configured: !!process.env[envVar],
        value: process.env[envVar] ? `${process.env[envVar].substring(0, 20)}...` : null,
      };
    }

    const envOk = requiredEnvVars.every(v => !!process.env[v]);
    checks.environment.status = envOk ? 'OK' : 'MISSING_VARS';

    // ────────────────────────────────────────────────────────────
    // 2. DATABASE CONNECTION & SCHEMA
    // ────────────────────────────────────────────────────────────
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );

    // Test basic connection
    const { count: userCount, error: userError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    checks.database.connection = userError ? 'FAILED' : 'OK';
    checks.database.error = userError?.message || null;

    // Check for required schema columns
    const { data: schemaCheck1, error: err1 } = await supabase
      .from('subscriptions')
      .select('nurture_unsubscribed')
      .limit(1);

    const { data: schemaCheck2, error: err2 } = await supabase
      .from('subscriptions')
      .select('alerts_unsubscribed')
      .limit(1);

    checks.database.nurture_unsubscribed = {
      present: !err1?.message?.includes('column'),
      error: err1?.message || null,
    };

    checks.database.alerts_unsubscribed = {
      present: !err2?.message?.includes('column'),
      error: err2?.message || null,
    };

    // Check email_log table
    const { error: emailLogErr } = await supabase
      .from('email_log')
      .select('id')
      .limit(1);

    checks.database.email_log_table = {
      present: !emailLogErr || emailLogErr.code !== '42P01',
      error: emailLogErr?.message || null,
    };

    // Check cron_runs table (optional)
    const { error: cronRunsErr } = await supabase
      .from('cron_runs')
      .select('id')
      .limit(1);

    checks.database.cron_runs_table = {
      present: !cronRunsErr || cronRunsErr.code !== '42P01',
      note: 'Optional table for operational logging',
      error: cronRunsErr?.message || null,
    };

    checks.database.stats = {
      total_users: userCount || 0,
    };

    const schemaComplete =
      checks.database.nurture_unsubscribed.present &&
      checks.database.alerts_unsubscribed.present &&
      checks.database.email_log_table.present;

    checks.database.status = schemaComplete ? 'READY' : 'SCHEMA_INCOMPLETE';

    // ────────────────────────────────────────────────────────────
    // 3. EMAIL SERVICE (RESEND)
    // ────────────────────────────────────────────────────────────
    try {
      const resendTest = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'test@getpricepulse.com',
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        }),
      });

      // Even if it fails (e.g., invalid test email), if we got a response, API is working
      checks.email.api_responding = resendTest.ok || resendTest.status === 400 || resendTest.status === 422;
      checks.email.api_key_valid = resendTest.status !== 401 && resendTest.status !== 403;
      checks.email.status = (checks.email.api_responding && checks.email.api_key_valid) ? 'OK' : 'FAILED';
      checks.email.response_code = resendTest.status;
    } catch (err) {
      checks.email.api_responding = false;
      checks.email.error = err.message;
      checks.email.status = 'ERROR';
    }

    // ────────────────────────────────────────────────────────────
    // 4. PAYMENT SERVICE (STRIPE)
    // ────────────────────────────────────────────────────────────
    try {
      const stripeTest = await fetch('https://api.stripe.com/v1/products', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.STRIPE_SECRET_KEY}:`).toString('base64')}`,
        },
      });

      checks.payment.api_responding = stripeTest.ok || stripeTest.status === 401;
      checks.payment.api_key_valid = stripeTest.status !== 401 && stripeTest.status !== 403;
      checks.payment.status = (checks.payment.api_responding && checks.payment.api_key_valid) ? 'OK' : 'FAILED';
      checks.payment.response_code = stripeTest.status;
    } catch (err) {
      checks.payment.api_responding = false;
      checks.payment.error = err.message;
      checks.payment.status = 'ERROR';
    }

    // ────────────────────────────────────────────────────────────
    // 5. API ENDPOINTS
    // ────────────────────────────────────────────────────────────
    const appUrl = process.env.APP_URL || 'https://getpricepulse.com';
    const criticalEndpoints = [
      { name: 'homepage', url: appUrl },
      { name: 'dashboard', url: `${appUrl}/dashboard.html` },
      { name: 'admin', url: `${appUrl}/admin.html` },
      { name: 'api_stats', url: `${appUrl}/api/stats` },
    ];

    checks.api.endpoints = {};
    let apiHealthy = true;

    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(endpoint.url, { method: 'GET', timeout: 5000 });
        checks.api.endpoints[endpoint.name] = {
          status: response.status,
          ok: response.ok || response.status < 500,
        };
        if (!response.ok && response.status >= 500) apiHealthy = false;
      } catch (err) {
        checks.api.endpoints[endpoint.name] = {
          status: 'ERROR',
          error: err.message,
        };
        apiHealthy = false;
      }
    }

    checks.api.status = apiHealthy ? 'OK' : 'ISSUES';

    // ────────────────────────────────────────────────────────────
    // 6. OVERALL STATUS
    // ────────────────────────────────────────────────────────────
    const isReady =
      envOk &&
      checks.database.status === 'READY' &&
      checks.email.status === 'OK' &&
      checks.payment.status === 'OK' &&
      checks.api.status === 'OK';

    if (isReady) {
      checks.overall = 'READY_FOR_LAUNCH';
    } else if (
      checks.database.status === 'SCHEMA_INCOMPLETE'
    ) {
      checks.overall = 'AWAITING_SCHEMA_MIGRATION';
    } else {
      checks.overall = 'ISSUES_DETECTED';
    }

  } catch (err) {
    checks.error = err.message;
    checks.overall = 'ERROR';
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(checks);
}
