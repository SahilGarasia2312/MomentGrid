'use strict';

/**
 * welcomeTemplate — Sent after email is verified.
 * @param {string} fullName
 * @param {string} role
 * @param {string} dashboardUrl
 * @returns {{ subject: string, html: string, text: string }}
 */
const welcomeTemplate = (fullName, role, dashboardUrl) => {
  const roleLabel = {
    studio_owner: 'Studio Owner',
    photographer: 'Photographer',
    client: 'Client',
    admin: 'Administrator',
  }[role] || 'Member';

  return {
    subject: `Welcome to MomentGrid, ${fullName}! 📸`,
    text: `Hi ${fullName},\n\nWelcome to MomentGrid! Your account is now active.\n\nGo to your dashboard: ${dashboardUrl}\n\n— The MomentGrid Team`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to MomentGrid</title>
  <style>
    body { margin:0; padding:0; background:#F8F6F3; font-family:'Inter',Helvetica,Arial,sans-serif; }
    .wrapper { max-width:580px; margin:40px auto; }
    .card { background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#1A1A2E,#2D2D4E); padding:40px; text-align:center; }
    .logo { color:#C8A96E; font-size:22px; font-weight:700; margin-bottom:16px; }
    .headline { color:#FFFFFF; font-size:28px; font-weight:700; margin:0; }
    .sub { color:rgba(255,255,255,0.7); font-size:15px; margin:8px 0 0; }
    .body { padding:40px; }
    p { color:#5C5648; font-size:15px; line-height:1.6; margin:0 0 20px; }
    .badge { display:inline-block; background:#F5ECD7; color:#A8843A; font-size:12px; font-weight:600; padding:4px 12px; border-radius:999px; letter-spacing:0.05em; text-transform:uppercase; }
    .btn { display:inline-block; background:linear-gradient(135deg,#C8A96E,#E8C97A); color:#1A1A2E; font-weight:700; font-size:15px; padding:14px 32px; border-radius:8px; text-decoration:none; }
    .footer { text-align:center; padding:24px 40px; color:#8C857A; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">✦ MomentGrid</div>
        <h1 class="headline">Welcome aboard! 🎉</h1>
        <p class="sub">Your account is verified and ready.</p>
      </div>
      <div class="body">
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>You're now a MomentGrid <span class="badge">${roleLabel}</span>. Everything is set up and ready for you.</p>
        <p>Head to your dashboard to get started:</p>
        <a href="${dashboardUrl}" class="btn">Go to Dashboard →</a>
        <p style="margin-top:28px;">If you have any questions, reply to this email — we're here to help.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} MomentGrid &bull; All rights reserved
      </div>
    </div>
  </div>
</body>
</html>`,
  };
};

module.exports = welcomeTemplate;
