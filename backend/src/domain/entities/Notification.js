'use strict';

/**
 * Notification — Pure Domain Entity
 *
 * Represents an automated notification dispatched across Email, In-App, and Real-Time SSE channels.
 * Covers Booking Updates, Gallery Ready alerts, Album Selection Ready alerts, and Payment Reminders.
 */
class Notification {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.recipientEmail
   * @param {string} [props.recipientRole] — 'client' | 'photographer' | 'studio_owner' | 'admin'
   * @param {string} props.type — 'booking_update' | 'gallery_ready' | 'album_ready' | 'payment_reminder'
   * @param {string} props.title
   * @param {string} props.body
   * @param {string} [props.actionUrl]
   * @param {string} [props.thumbnailUrl]
   * @param {boolean} [props.isRead]
   * @param {Date} [props.createdAt]
   * @param {Date} [props.updatedAt]
   */
  constructor(props) {
    this.id = props.id;
    this.recipientEmail = props.recipientEmail;
    this.recipientRole = props.recipientRole || 'client';
    this.type = props.type || 'booking_update';
    this.title = props.title || 'Notification';
    this.body = props.body || '';
    this.actionUrl = props.actionUrl || '/client/dashboard';
    this.thumbnailUrl = props.thumbnailUrl || null;
    this.isRead = props.isRead ?? false;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Mark the notification as read.
   */
  markAsRead() {
    this.isRead = true;
    this.updatedAt = new Date();
  }

  /**
   * Mark the notification as unread.
   */
  markAsUnread() {
    this.isRead = false;
    this.updatedAt = new Date();
  }

  /**
   * Convert to clean JSON payload for REST responses or real-time SSE broadcasts.
   * @returns {object}
   */
  toPayload() {
    return {
      id: this.id,
      recipient_email: this.recipientEmail,
      recipient_role: this.recipientRole,
      type: this.type,
      title: this.title,
      body: this.body,
      is_read: this.isRead,
      action_url: this.actionUrl,
      thumbnail_url: this.thumbnailUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

module.exports = Notification;
