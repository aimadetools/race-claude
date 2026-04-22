-- PricePulse — Migration: Add email_log table
-- Run this in the Supabase SQL editor.
-- This enables the /api/email-nurture.js automated email sequences.
--
-- After running this migration, add the email-nurture cron job:
--   Every hour: POST https://getpricepulse.com/api/email-nurture
--   Body: { "secret": "<CRON_SECRET>" }

-- ============================================================
-- email_log — tracks which lifecycle emails have been sent
-- ============================================================
-- email_type: 'welcome' | 'activation_nudge' | 'upgrade_prompt' | 'reengagement'
-- UNIQUE(user_id, email_type) ensures each email is sent only once per user.
-- The INSERT ... ON CONFLICT DO NOTHING pattern makes sends idempotent.

CREATE TABLE IF NOT EXISTS email_log (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type  text NOT NULL CHECK (email_type IN ('welcome', 'activation_nudge', 'upgrade_prompt', 'reengagement', 'first_monitor_added')),
  sent_at     timestamptz NOT NULL DEFAULT now(),
  resend_id   text,        -- Resend email ID for deliverability tracking
  UNIQUE (user_id, email_type)
);

-- Only service role reads/writes (cron job uses service key)
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own email history (for future unsubscribe flows)
CREATE POLICY "Users can read their own email log"
  ON email_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX email_log_user ON email_log(user_id);
CREATE INDEX email_log_type_sent ON email_log(email_type, sent_at DESC);
