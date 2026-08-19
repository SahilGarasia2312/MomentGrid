'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repositories & Services
const MongoNotificationRepository = require('../../infrastructure/database/repositories/MongoNotificationRepository');
const notificationService = require('../../infrastructure/notifications/NotificationService');

// Use Cases
const CreateAndDispatchNotificationUseCase = require('../../application/usecases/notification/CreateAndDispatchNotificationUseCase');
const GetClientNotificationsUseCase = require('../../application/usecases/notification/GetClientNotificationsUseCase');
const MarkNotificationsAsReadUseCase = require('../../application/usecases/notification/MarkNotificationsAsReadUseCase');
const TriggerSystemRemindersUseCase = require('../../application/usecases/notification/TriggerSystemRemindersUseCase');

const notificationRepository = new MongoNotificationRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * NotificationController
 *
 * Handles REST endpoints for listing, counting unread alerts, batch marking as read,
 * triggering simulation alerts, inspecting HTML email logs, and subscribing to live SSE streams.
 */
class NotificationController {
  async listNotifications(req, res, next) {
    try {
      assertValid(req);
      const { recipientEmail, isRead, type, page, limit } = req.query;

      const useCase = new GetClientNotificationsUseCase({ notificationRepository });
      const result = await useCase.execute({
        recipientEmail,
        isRead: typeof isRead === 'string' ? isRead === 'true' : undefined,
        type,
        page: Number(page || 1),
        limit: Number(limit || 20),
      });

      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      assertValid(req);
      const { recipientEmail } = req.query;

      const count = await notificationRepository.getUnreadCount(recipientEmail);
      return res.status(200).json({
        success: true,
        message: 'Unread notification count retrieved successfully.',
        data: { unreadCount: count },
      });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      assertValid(req);
      const { notificationIds, recipientEmail, markAll } = req.body;

      const useCase = new MarkNotificationsAsReadUseCase({ notificationRepository });
      const result = await useCase.execute({
        notificationIds,
        recipientEmail,
        markAll,
      });

      return res.status(200).json({
        success: true,
        message: 'Notifications marked as read successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async dispatchNotification(req, res, next) {
    try {
      assertValid(req);
      const {
        recipientEmail,
        recipientRole,
        type,
        title,
        body,
        actionUrl,
        thumbnailUrl,
        sendEmail,
        sendRealTime,
      } = req.body;

      const useCase = new CreateAndDispatchNotificationUseCase({ notificationRepository });
      const result = await useCase.execute({
        recipientEmail,
        recipientRole,
        type,
        title,
        body,
        actionUrl,
        thumbnailUrl,
        sendEmail,
        sendRealTime,
      });

      return res.status(201).json({
        success: true,
        message: 'Notification created and dispatched across channels successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async simulateReminder(req, res, next) {
    try {
      assertValid(req);
      const { recipientEmail, reminderType } = req.body;

      const useCase = new TriggerSystemRemindersUseCase({ notificationRepository });
      const result = await useCase.execute({
        recipientEmail,
        reminderType,
      });

      return res.status(200).json({
        success: true,
        message: `Simulated ${reminderType || 'gallery_ready'} reminder triggered across Real-Time & Email channels.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;

      await notificationRepository.deleteById(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * Server-Sent Events (SSE) stream endpoint (`GET /v1/notifications/stream?email=...`)
   */
  streamNotifications(req, res) {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: 'email query parameter required for SSE stream.' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering if proxying
    res.flushHeaders();

    // Register active stream connection
    notificationService.subscribeToStream(email, res);
  }

  /**
   * Get recently dispatched HTML email logs (`GET /v1/notifications/email-log?email=...`)
   */
  async getEmailLog(req, res, next) {
    try {
      const { email } = req.query;
      const logs = notificationService.getEmailLog(email);

      return res.status(200).json({
        success: true,
        message: 'Recent HTML email dispatch log retrieved successfully.',
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
