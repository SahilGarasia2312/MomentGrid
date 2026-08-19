'use strict';

/**
 * verificationTemplate — HTML email for email verification.
 * @param {string} fullName
 * @param {string} verificationUrl
 * @returns {{ subject: string, html: string, text: string }}
 */
const verificationTemplate = (fullName, verificationUrl) => ({
  subject: 'Verify your MomentGrid email address',
  text: `Hi ${fullName},\n\nPlease verify your email by visiting:\n${verificationUrl}\n\nThis link expires in 24 hours.\n\n— The MomentGrid Team`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    body { margin:0; padding:0; background:#F8F6F3; font-family:'Inter',Helvetica,Arial,sans-serif; }
    .wrapper { max-width:580px; margin:40px auto; }
    .card { background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:#1A1A2E; padding:32px 40px; text-align:center; }
    .logo { color:#C8A96E; font-size:22px; font-weight:700; letter-spacing:-0.5px; }
    .body { padding:40px; }
    h1 { font-size:24px; color:#1A1814; margin:0 0 12px; font-weight:600; }
    p { color:#5C5648; font-size:15px; line-height:1.6; margin:0 0 20px; }
    .btn { display:inline-block; background:linear-gradient(135deg,#C8A96E,#E8C97A); color:#1A1A2E; font-weight:700; font-size:15px; padding:14px 32px; border-radius:8px; text-decoration:none; }
    .divider { border:none; border-top:1px solid #E8E3DC; margin:28px 0; }
    .link-fallback { font-size:12px; color:#8C857A; word-break:break-all; }
    .footer { text-align:center; padding:24px 40px; color:#8C857A; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">✦ MomentGrid</div>
      </div>
      <div class="body">
        <h1>Verify your email address</h1>
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Thanks for creating your MomentGrid account. Click the button below to verify your email and activate your account.</p>
        <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        <hr class="divider"/>
        <p>This link expires in <strong>24 hours</strong>. If you didn't create this account, you can safely ignore this email.</p>
        <p class="link-fallback">Or copy this link into your browser:<br/>${verificationUrl}</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} MomentGrid &bull; All rights reserved
      </div>
    </div>
  </div>
</body>
</html>`,
});

module.exports = verificationTemplate;
