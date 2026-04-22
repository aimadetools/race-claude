# Email Unsubscribe Implementation — Remaining Tasks

**Status:** Partially Complete (Session 24)
**Infrastructure:** ✅ Complete
**Remaining:** Minor HTML footer updates to 4 email templates

---

## What's Done ✅

1. **`/api/unsubscribe.js`** — Complete endpoint with HMAC verification
2. **`email-nurture.js`** — Updated to:
   - Filter unsubscribed users in all email queries
   - Generate HMAC-signed unsubscribe tokens
   - Pass userId to all email template functions
3. **Schema migration** — `docs/schema-migration-unsubscribe.sql` ready to run
4. **Welcome email** — `buildWelcomeHtml()` includes unsubscribe link in footer

---

## What Remains ⏳

Add unsubscribe link to footers of 4 remaining email templates:

1. **`buildFirstMonitorHtml(firstName, competitorName, userId)`** — ~line 409
   - Add to footer: `const unsubscribeLink = generateUnsubscribeLink(userId);`
   - Add link to footer HTML like welcome email

2. **`buildActivationNudgeHtml(firstName, userId)`** — ~line 473
   - Same approach

3. **`buildUpgradePromptHtml(firstName, userId)`** — ~line 531
   - Same approach

4. **`buildReengagementHtml(firstName, userId)`** — ~line 594
   - Same approach

---

## Template Footer Pattern

```html
<!-- Footer -->
<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
    [existing footer text]<br>
    <a href="${unsubscribeLink}" style="color:#9ca3af;text-decoration:underline">Unsubscribe from nurture emails</a>
  </p>
</td></tr>
```

---

## Before Week 1 Launch

1. Run schema migration in Supabase SQL editor:
   ```bash
   # In Supabase → SQL Editor, paste contents of:
   docs/schema-migration-unsubscribe.sql
   ```

2. Complete remaining email template updates (quick, 5 min)

3. Test:
   - Send welcome email via /api/email-nurture
   - Click unsubscribe link
   - Verify user is marked nurture_unsubscribed = true
   - Next nurture run should skip that user

---

**Priority:** Medium (infrastructure works, HTML is cosmetic)
**Effort:** 5 minutes for remaining templates
**Testing:** 2-3 minutes
