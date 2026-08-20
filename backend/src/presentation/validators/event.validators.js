'use strict';

const { body } = require('express-validator');

exports.createEventValidator = [
  body('studioId').notEmpty().withMessage('Studio ID is required'),
  body('title').notEmpty().withMessage('Event title is required'),
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('clientEmail').isEmail().withMessage('Valid client email is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required (YYYY-MM-DD)'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:mm format'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:mm format'),
];

exports.updateEventValidator = [
  body('title').optional().notEmpty().withMessage('Event title cannot be empty'),
  body('eventDate').optional().isISO8601().withMessage('Valid event date is required (YYYY-MM-DD)'),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:mm format'),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:mm format'),
];

exports.updateEventStatusValidator = [
  body('status').notEmpty().withMessage('Status is required'),
];
