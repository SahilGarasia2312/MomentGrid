'use strict';

const AppError = require('../../errors/AppError');
const notificationService = require('../../../infrastructure/notifications/NotificationService');

class CreateAndDispatchNotificationUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({
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
    if (!recipientEmail || !recipientEmail.trim()) {
      throw new AppError('Recipient email is required.', 400, 'RECIPIENT_EMAIL_REQUIRED');
    }
    if (!title || !title.trim()) {
      throw new AppError('Notification title is required.', 400, 'NOTIFICATION_TITLE_REQUIRED');
    }
    if (!body || !body.trim()) {
      throw new AppError('Notification body is required.', 400, 'NOTIFICATION_BODY_REQUIRED');
    }

    const result = await notificationService.dispatch({
      repository: this.notificationRepository,
      recipientEmail: recipientEmail.trim(),
      recipientRole,
      type,
      title: title.trim(),
      body: body.trim(),
      actionUrl,
      thumbnailUrl,
      sendEmail,
      sendRealTime,
    });

    return result;
  }
}

module.exports = CreateAndDispatchNotificationUseCase;
