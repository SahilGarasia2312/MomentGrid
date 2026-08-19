'use strict';

const AppError = require('../../errors/AppError');
const notificationService = require('../../../infrastructure/notifications/NotificationService');

class MarkNotificationsAsReadUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ notificationIds = [], recipientEmail, markAll = false }) {
    if (!recipientEmail || !recipientEmail.trim()) {
      throw new AppError('Recipient email is required.', 400, 'RECIPIENT_EMAIL_REQUIRED');
    }
    if (!markAll && (!Array.isArray(notificationIds) || notificationIds.length === 0)) {
      throw new AppError('Must provide notificationIds array or markAll: true.', 400, 'NO_NOTIFICATIONS_SPECIFIED');
    }

    const markedCount = await this.notificationRepository.markAsRead({
      notificationIds,
      recipientEmail: recipientEmail.trim(),
      markAll,
    });

    // Get updated unread count and broadcast via real-time stream
    const unreadCount = await this.notificationRepository.getUnreadCount(recipientEmail.trim());
    notificationService.broadcastToStream(recipientEmail.trim(), 'unread_count_updated', { count: unreadCount });

    return {
      markedCount,
      unreadCount,
    };
  }
}

module.exports = MarkNotificationsAsReadUseCase;
