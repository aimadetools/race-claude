-- Migration: Add alerts_unsubscribed column to subscriptions table
-- Purpose: Allow users to unsubscribe from alert emails separately from nurture emails
-- Users can receive price alerts but opt out of marketing emails (or vice versa)

-- Add column to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN alerts_unsubscribed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries filtering unsubscribed users
CREATE INDEX idx_subscriptions_alerts_unsubscribed
ON subscriptions(alerts_unsubscribed)
WHERE alerts_unsubscribed = false;
