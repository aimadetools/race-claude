-- Migration: Add nurture_unsubscribed column to subscriptions table
-- Purpose: Compliance with CAN-SPAM and GDPR regulations
-- Run this in Supabase SQL editor to enable unsubscribe functionality

-- Add column to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN nurture_unsubscribed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries filtering unsubscribed users
CREATE INDEX idx_subscriptions_nurture_unsubscribed
ON subscriptions(nurture_unsubscribed)
WHERE nurture_unsubscribed = false;

-- Update email_log table to track unsubscribe events (if needed)
-- Can be extended later to log unsubscribe timestamp and reason

-- Verify migration
-- SELECT COUNT(*) FROM subscriptions WHERE nurture_unsubscribed = true; -- should be 0 initially
