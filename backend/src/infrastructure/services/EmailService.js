'use strict';

const nodemailer = require('nodemailer');
const verificationTemplate = require('../email/templates/verificationTemplate');
const resetPasswordTemplate = require('../email/templates/resetPasswordTemplate');
const welcomeTemplate = require('../email/templates/welcomeTemplate');

/**
 * EmailService — Nodemailer wrapper.
 *
 * Development:  Uses Ethereal (fake SMTP) — auto-creates test account,
 *               logs email preview URL to console. No config needed.
 * Production:   Set SMTP_HOST/PORT/USER/PASS in .env.
 */
class EmailService {
  constructor() {
    this._transporter = null;
    this._ready = false;
    this._init();
  }

  async _init() {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && process.env.SMTP_HOST) {
      // Production SMTP
      this._transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Ethereal auto-account
      const testAccount = await nodemailer.createTestAccount();
      this._transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.log(`📬 Ethereal email account created: ${testAccount.user}`);
    }

    this._ready = true;
  }

  async _ensureReady() {
    if (!this._ready) {
      // Wait for init (max 5s)
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Email service init timeout')), 5000);
        const check = setInterval(() => {
          if (this._ready) {
            clearInterval(check);
            clearTimeout(timeout);
            resolve();
          }
        }, 100);
      });
    }
  }

  /**
   * Core send method.
   * @param {object} opts
   * @param {string} opts.to
   * @param {string} opts.subject
   * @param {string} opts.html
   * @param {string} opts.text
   */
  async _send({ to, subject, html, text }) {
    await this._ensureReady();

    const info = await this._transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'MomentGrid'}" <${process.env.EMAIL_FROM || 'noreply@momentgrid.io'}>`,
      to,
      subject,
      html,
      text,
    });

    // In dev, log the Ethereal preview URL
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`📧 Email preview: ${previewUrl}`);
    }

    return info;
  }

  // ── Public Methods ────────────────────────────────────────────────────────

  /**
   * Send email verification link.
   * @param {import('../../domain/entities/User')} user
   * @param {string} rawToken
   */
  async sendVerificationEmail(user, rawToken) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const url = `${clientUrl}/auth/verify-email?token=${rawToken}`;
    const { subject, html, text } = verificationTemplate(user.fullName, url);
    return this._send({ to: user.email, subject, html, text });
  }

  /**
   * Send password reset link.
   * @param {import('../../domain/entities/User')} user
   * @param {string} rawToken
   */
  async sendPasswordResetEmail(user, rawToken) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const url = `${clientUrl}/auth/reset-password?token=${rawToken}`;
    const { subject, html, text } = resetPasswordTemplate(user.fullName, url);
    return this._send({ to: user.email, subject, html, text });
  }

  /**
   * Send welcome email after email verification.
   * @param {import('../../domain/entities/User')} user
   */
  async sendWelcomeEmail(user) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const dashboardUrl = `${clientUrl}/dashboard`;
    const { subject, html, text } = welcomeTemplate(user.fullName, user.role, dashboardUrl);
    return this._send({ to: user.email, subject, html, text });
  }
}

module.exports = new EmailService(); // singleton
