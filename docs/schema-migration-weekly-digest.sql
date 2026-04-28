-- Migration: Add last_weekly_digest_at column to subscriptions table
-- Purpose: Track when each user last received the weekly pricing digest email
--          Enables sending weekly digests without the UNIQUE(user_id, email_type) conflict
-- Run this in Supabase SQL editor.

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS last_weekly_digest_at TIMESTAMPTZ;

-- Index for fast querying of users due for weekly digest
CREATE INDEX IF NOT EXISTS idx_subscriptions_weekly_digest
ON subscriptions(last_weekly_digest_at)
WHERE last_weekly_digest_at IS NOT NULL;

-- Verify
-- SELECT COUNT(*) FROM subscriptions WHERE last_weekly_digest_at IS NULL; -- all users initially
