'use strict';

const AppError = require('../../errors/AppError');

class GetClientNotificationsUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ recipientEmail, isRead, type, page = 1, limit = 20 }) {
    if (!recipientEmail || !recipientEmail.trim()) {
      throw new AppError('Recipient email is required.', 400, 'RECIPIENT_EMAIL_REQUIRED');
    }

    const [listResult, unreadCount] = await Promise.all([
      this.notificationRepository.findByRecipientEmail(recipientEmail.trim(), {
        isRead: typeof isRead === 'boolean' ? isRead : undefined,
        type,
        page,
        limit,
      }),
      this.notificationRepository.getUnreadCount(recipientEmail.trim()),
    ]);

    return {
      notifications: listResult.notifications,
      unreadCount,
      pagination: listResult.pagination,
    };
  }
}

module.exports = GetClientNotificationsUseCase;
