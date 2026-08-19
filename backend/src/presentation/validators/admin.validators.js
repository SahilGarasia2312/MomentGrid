'use strict';

const { body, param, query } = require('express-validator');

const getUsersValidator = [
  query('role').optional().isIn(['all', 'admin', 'studio_owner', 'photographer', 'client']),
  query('status').optional().isIn(['all', 'active', 'suspended', 'pending_verification']),
  query('search').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const updateUserStatusValidator = [
  param('id').isMongoId().withMessage('User ID must be a valid Mongo ObjectId.'),
  body('status').optional().isIn(['active', 'suspended', 'pending_verification']).withMessage('Invalid status.'),
  body('role').optional().isIn(['admin', 'studio_owner', 'photographer', 'client']).withMessage('Invalid role.'),
];

const getStudiosValidator = [
  query('search').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const getPhotographersValidator = [
  query('search').optional().isString().trim(),
  query('studioId').optional({ checkFalsy: true }).isMongoId().withMessage('studioId must be a valid Mongo ObjectId.'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const getClientsValidator = [
  query('search').optional().isString().trim(),
  query('status').optional().isIn(['all', 'active', 'suspended', 'pending_verification']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const getActivityLogsValidator = [
  query('type').optional().isIn(['all', 'user_update', 'studio_update', 'settings', 'report', 'login', 'other']),
  query('search').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const updateSettingsValidator = [
  body('maintenanceMode').optional().isBoolean(),
  body('userRegistrationEnabled').optional().isBoolean(),
  body('maxUploadsPerStudio').optional().isInt({ min: 1, max: 10000 }),
  body('emailSenderName').optional().isString().trim(),
  body('razorpayMode').optional().isIn(['test', 'live']),
  body('supportEmail').optional().isEmail().withMessage('Must be a valid email.'),
];

module.exports = {
  getUsersValidator,
  updateUserStatusValidator,
  getStudiosValidator,
  getPhotographersValidator,
  getClientsValidator,
  getActivityLogsValidator,
  updateSettingsValidator,
};
