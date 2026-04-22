# Supabase Email Templates — PricePulse Branding

These templates replace the default Supabase auth emails with branded versions.
Set them in: Supabase Dashboard → Authentication → Email Templates.

---

## 1. Confirm signup (most important — sent on registration)

**Subject:** `Confirm your PricePulse account`

**Body (HTML):**

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<tr><td style="background:linear-gradient(135deg,#00e5a0,#00b87a);padding:40px;text-align:center">
  <div style="font-size:36px;margin-bottom:12px">📡</div>
  <h1 style="margin:0;font-size:24px;font-weight:700;color:#0a0a0f">You're almost in!</h1>
  <p style="margin:8px 0 0;font-size:15px;color:rgba(10,10,15,0.75)">Confirm your email to start monitoring competitors</p>
</td></tr>

<tr><td style="padding:40px">
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    Click the button below to confirm your email address. Once confirmed, you'll choose your plan and set up your first competitor monitor.
  </p>

  <a href="{{ .ConfirmationURL }}"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:16px;padding:16px 24px;border-radius:8px;margin:0 0 24px">
    Confirm my email →
  </a>

  <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0 0 16px">
    This link expires in 24 hours. If you didn't create a PricePulse account, you can safely ignore this email.
  </p>

  <p style="font-size:13px;color:#9ca3af;margin:0">
    Or copy this URL: <span style="color:#6b7280;word-break:break-all">{{ .ConfirmationURL }}</span>
  </p>
</td></tr>

<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
    PricePulse — Competitor pricing intelligence for SaaS founders<br>
    <a href="https://getpricepulse.com" style="color:#9ca3af">getpricepulse.com</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
```

---

## 2. Magic link (used for passwordless login)

**Subject:** `Your PricePulse login link`

**Body (HTML):**

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<tr><td style="background:#0a0a0f;padding:28px 40px">
  <div style="font-size:18px;font-weight:700;color:#00e5a0">PricePulse</div>
</td></tr>

<tr><td style="padding:40px">
  <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px">Your login link</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    Click below to sign in to your PricePulse account. This link is valid for 1 hour.
  </p>

  <a href="{{ .ConfirmationURL }}"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 24px">
    Sign in to PricePulse →
  </a>

  <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0">
    If you didn't request this, ignore this email. Your account is secure.
  </p>
</td></tr>

<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af">
    PricePulse · <a href="https://getpricepulse.com" style="color:#9ca3af">getpricepulse.com</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
```

---

## 3. Reset password

**Subject:** `Reset your PricePulse password`

**Body (HTML):**

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">

<tr><td style="background:#0a0a0f;padding:28px 40px">
  <div style="font-size:18px;font-weight:700;color:#00e5a0">PricePulse</div>
</td></tr>

<tr><td style="padding:40px">
  <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px">Reset your password</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 24px">
    We received a request to reset your PricePulse password. Click below to set a new one.
  </p>

  <a href="{{ .ConfirmationURL }}"
     style="display:block;background:#00e5a0;color:#0a0a0f;text-align:center;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:8px;margin:0 0 24px">
    Reset my password →
  </a>

  <p style="font-size:13px;color:#6b7280;margin:0">
    If you didn't request a password reset, ignore this email. Your account is secure.
  </p>
</td></tr>

<tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
  <p style="margin:0;font-size:12px;color:#9ca3af">
    PricePulse · <a href="https://getpricepulse.com" style="color:#9ca3af">getpricepulse.com</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>
```

---

## How to set these in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Navigate to: **Authentication** → **Email Templates**
3. For each template type (Confirm signup, Magic Link, Reset Password):
   - Click the template
   - Replace the **Subject** field
   - Replace the **Body** with the HTML above
   - Click **Save**

**Important:** Supabase uses `{{ .ConfirmationURL }}` as the variable for confirmation links. Keep this exactly as-is.
