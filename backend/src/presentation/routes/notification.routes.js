'use strict';

const express = require('express');
const router = express.Router();

const NotificationController = require('../controllers/NotificationController');
const {
  listNotificationsValidator,
  getUnreadCountValidator,
  markAsReadValidator,
  dispatchNotificationValidator,
  simulateReminderValidator,
  deleteNotificationValidator,
} = require('../validators/notification.validators');

// GET /v1/notifications/stream — Real-time Server-Sent Events (SSE) stream
router.get('/stream', NotificationController.streamNotifications.bind(NotificationController));

// GET /v1/notifications/email-log — Inspect recently dispatched HTML email templates
router.get('/email-log', NotificationController.getEmailLog.bind(NotificationController));

// GET /v1/notifications/unread-count — Get exact unread count for badge
router.get(
  '/unread-count',
  getUnreadCountValidator,
  NotificationController.getUnreadCount.bind(NotificationController)
);

// GET /v1/notifications — List paginated notifications with filters
router.get(
  '/',
  listNotificationsValidator,
  NotificationController.listNotifications.bind(NotificationController)
);

// PATCH /v1/notifications/read — Mark selected or all notifications as read
router.patch(
  '/read',
  markAsReadValidator,
  NotificationController.markAsRead.bind(NotificationController)
);

// POST /v1/notifications/dispatch — Create and dispatch across channels
router.post(
  '/dispatch',
  dispatchNotificationValidator,
  NotificationController.dispatchNotification.bind(NotificationController)
);

// POST /v1/notifications/simulate — Trigger instant sample alerts (Booking, Gallery, Album, Payment)
router.post(
  '/simulate',
  simulateReminderValidator,
  NotificationController.simulateReminder.bind(NotificationController)
);

// DELETE /v1/notifications/:id — Delete notification
router.delete(
  '/:id',
  deleteNotificationValidator,
  NotificationController.deleteNotification.bind(NotificationController)
);

module.exports = router;
