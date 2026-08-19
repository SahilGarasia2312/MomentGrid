'use strict';

const Notification = require('../../domain/entities/Notification');

/**
 * NotificationService — Multi-Channel Communication Engine
 *
 * Orchestrates delivery across 3 primary channels:
 * 1. In-App Persistence (MongoDB repository)
 * 2. Real-Time Streaming (Server-Sent Events / SSE active connection registry)
 * 3. Luxury HTML Email Dispatch (Cinematic dark/gold template generation & queueing)
 */
class NotificationService {
  constructor() {
    // Active SSE subscriber connections mapped by email -> Array<ExpressResponse>
    this.sseSubscribers = new Map();
    // Memory audit log of sent emails for instant UI preview and verification
    this.emailLog = [];
  }

  /**
   * Register a new Server-Sent Events (SSE) client stream connection.
   * @param {string} email
   * @param {object} res — Express HTTP response object configured with text/event-stream
   */
  subscribeToStream(email, res) {
    const key = (email || '').toLowerCase().trim();
    if (!key) return;

    if (!this.sseSubscribers.has(key)) {
      this.sseSubscribers.set(key, []);
    }
    this.sseSubscribers.get(key).push(res);

    // Send connection established handshake event
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

    // Clean up when client closes tab/connection
    res.on('close', () => {
      this.unsubscribeFromStream(key, res);
    });
  }

  /**
   * Remove a closed SSE client stream connection.
   */
  unsubscribeFromStream(email, res) {
    const key = (email || '').toLowerCase().trim();
    const list = this.sseSubscribers.get(key);
    if (!list) return;

    const filtered = list.filter((r) => r !== res);
    if (filtered.length === 0) {
      this.sseSubscribers.delete(key);
    } else {
      this.sseSubscribers.set(key, filtered);
    }
  }

  /**
   * Broadcast a real-time event to all active open tabs for a user.
   */
  broadcastToStream(email, eventType, payload) {
    const key = (email || '').toLowerCase().trim();
    const list = this.sseSubscribers.get(key);
    if (!list || list.length === 0) return;

    const message = `data: ${JSON.stringify({ type: eventType, data: payload })}\n\n`;
    list.forEach((res) => {
      try {
        res.write(message);
      } catch (err) {
        // Remove dead stream if write fails
        this.unsubscribeFromStream(key, res);
      }
    });
  }

  /**
   * Generate luxury cinematic HTML email matching MomentGrid brand design (#C8A96E Gold & #161628 Deep Night).
   */
  generateHtmlEmail({ type, title, body, actionUrl, recipientEmail }) {
    const brandColor = '#C8A96E';
    const bgDark = '#0A0A14';
    const cardBg = '#161628';
    const accentSubtle = '#23233E';

    let iconBadge = '📸 MomentGrid Alert';
    let ctaLabel = 'View in Client Dashboard';
    if (type === 'booking_update') {
      iconBadge = '📅 Booking Confirmed';
      ctaLabel = 'Review Session Schedule';
    } else if (type === 'gallery_ready') {
      iconBadge = '✨ Master Gallery Live';
      ctaLabel = 'Enter Heirloom Gallery';
    } else if (type === 'album_ready') {
      iconBadge = '📖 Luxe Album Selection Open';
      ctaLabel = 'Choose Favorite Photos';
    } else if (type === 'payment_reminder') {
      iconBadge = '💳 Cryptographic Escrow Notice';
      ctaLabel = 'Access Payment Suite';
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { background-color: ${bgDark}; color: #FFFFFF; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 40px 20px; }
    .container { max-width: 580px; margin: 0 auto; background-color: ${cardBg}; border: 1px solid rgba(200, 169, 110, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(135deg, #1A1A32 0%, #0F0F20 100%); padding: 30px 40px; border-bottom: 1px solid rgba(200, 169, 110, 0.15); }
    .brand { font-size: 14px; font-weight: 800; letter-spacing: 3px; color: ${brandColor}; text-transform: uppercase; }
    .content { padding: 40px; }
    .badge { display: inline-block; background-color: rgba(200, 169, 110, 0.15); color: ${brandColor}; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 20px; }
    .title { font-size: 26px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.3; color: #FFFFFF; }
    .body { font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.75); margin: 0 0 32px 0; }
    .cta-container { text-align: left; }
    .cta-btn { display: inline-block; background-color: ${brandColor}; color: #0A0A14 !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 16px 32px; border-radius: 14px; letter-spacing: 0.5px; transition: transform 0.2s; }
    .footer { background-color: ${bgDark}; padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">M O M E N T G R I D • L U X E</div>
    </div>
    <div class="content">
      <div class="badge">${iconBadge}</div>
      <h1 class="title">${title}</h1>
      <p class="body">${body}</p>
      <div class="cta-container">
        <a href="http://localhost:3000${actionUrl}" class="cta-btn">${ctaLabel} &rarr;</a>
      </div>
    </div>
    <div class="footer">
      Dispatched to ${recipientEmail} • Cryptographic Milestone Ledger<br/>
      MomentGrid Collective — Milan • Como • Zurich
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Master Dispatch Method.
   * Saves to database, broadcasts to active SSE subscribers, and queues luxury HTML email.
   */
  async dispatch({
    repository,
    recipientEmail,
    recipientRole = 'client',
    type = 'booking_update',
    title,
    body,
    actionUrl = '/client/dashboard',
    thumbnailUrl = null,
    sendEmail = true,
    sendRealTime = true,
  }) {
    // 1. Create and persist domain notification
    const notification = new Notification({
      recipientEmail,
      recipientRole,
      type,
      title,
      body,
      actionUrl,
      thumbnailUrl,
      isRead: false,
    });

    let savedNotification = notification;
    if (repository && typeof repository.save === 'function') {
      savedNotification = await repository.save(notification);
    }

    // 2. Generate and log HTML email if enabled
    let htmlEmail = null;
    if (sendEmail) {
      htmlEmail = this.generateHtmlEmail({
        type,
        title,
        body,
        actionUrl,
        recipientEmail,
      });

      this.emailLog.unshift({
        id: `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        recipientEmail,
        type,
        title,
        body,
        actionUrl,
        htmlContent: htmlEmail,
        dispatchedAt: new Date().toISOString(),
      });

      // Keep recent 50 emails in memory
      if (this.emailLog.length > 50) {
        this.emailLog.pop();
      }

      console.log(`[NotificationService] 📧 Email dispatched to <${recipientEmail}> [${type}]: "${title}"`);
    }

    // 3. Broadcast real-time SSE event to all open browser tabs for this user
    if (sendRealTime) {
      this.broadcastToStream(recipientEmail, 'notification_dispatched', savedNotification.toPayload());
      // Also broadcast updated unread count
      if (repository && typeof repository.getUnreadCount === 'function') {
        const count = await repository.getUnreadCount(recipientEmail);
        this.broadcastToStream(recipientEmail, 'unread_count_updated', { count });
      }
    }

    return {
      notification: savedNotification,
      emailDispatched: sendEmail,
      realTimeBroadcasted: sendRealTime,
      htmlEmailPreview: htmlEmail,
    };
  }

  /**
   * Get the memory email outbox log (useful for UI testing & verification).
   */
  getEmailLog(email = null) {
    if (!email) return this.emailLog;
    const key = email.toLowerCase().trim();
    return this.emailLog.filter((e) => e.recipientEmail.toLowerCase() === key);
  }
}

// Singleton export so all controllers share the same SSE connection registry & email log outbox
module.exports = new NotificationService();
