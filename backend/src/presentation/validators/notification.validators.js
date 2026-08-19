'use strict';

const { body, param, query } = require('express-validator');

const listNotificationsValidator = [
  query('recipientEmail').notEmpty().withMessage('recipientEmail query parameter is required.').isEmail().withMessage('Must be a valid email.'),
  query('isRead').optional().isBoolean().withMessage('isRead must be boolean true or false.'),
  query('type').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.'),
];

const getUnreadCountValidator = [
  query('recipientEmail').notEmpty().withMessage('recipientEmail query parameter is required.').isEmail().withMessage('Must be a valid email.'),
];

const markAsReadValidator = [
  body('recipientEmail').notEmpty().withMessage('recipientEmail is required.').isEmail().withMessage('Must be a valid email.'),
  body('notificationIds').optional().isArray().withMessage('notificationIds must be an array of IDs.'),
  body('markAll').optional().isBoolean().withMessage('markAll must be boolean true or false.'),
];

const dispatchNotificationValidator = [
  body('recipientEmail').notEmpty().withMessage('recipientEmail is required.').isEmail().withMessage('Must be a valid email.'),
  body('recipientRole').optional().isIn(['client', 'photographer', 'studio_owner', 'admin']),
  body('type').optional().isIn(['booking_update', 'gallery_ready', 'album_ready', 'payment_reminder']),
  body('title').notEmpty().withMessage('title is required.').isString().trim(),
  body('body').notEmpty().withMessage('body is required.').isString().trim(),
  body('actionUrl').optional().isString().trim(),
  body('thumbnailUrl').optional({ checkFalsy: true }).isURL().withMessage('thumbnailUrl must be a valid URL if provided.'),
  body('sendEmail').optional().isBoolean(),
  body('sendRealTime').optional().isBoolean(),
];

const simulateReminderValidator = [
  body('recipientEmail').notEmpty().withMessage('recipientEmail is required.').isEmail().withMessage('Must be a valid email.'),
  body('reminderType').optional().isIn(['booking_update', 'gallery_ready', 'album_ready', 'payment_reminder']),
];

const deleteNotificationValidator = [
  param('id').isMongoId().withMessage('Must be a valid Mongo ObjectId.'),
];

module.exports = {
  listNotificationsValidator,
  getUnreadCountValidator,
  markAsReadValidator,
  dispatchNotificationValidator,
  simulateReminderValidator,
  deleteNotificationValidator,
};
