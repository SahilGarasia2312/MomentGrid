'use strict';

const { body, query } = require('express-validator');

// feature: validate availability check query params
const availabilityValidator = [
  query('studioId')
    .trim()
    .notEmpty().withMessage('Studio ID parameter is required.'),
  query('date')
    .trim()
    .notEmpty().withMessage('Date parameter (YYYY-MM-DD) is required.')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be formatted as YYYY-MM-DD.'),
];

// feature: validate new session booking submission
const createBookingValidator = [
  body('studioId')
    .trim()
    .notEmpty().withMessage('Studio ID is required.'),
  body('clientName')
    .trim()
    .notEmpty().withMessage('Client name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters.'),
  body('clientEmail')
    .trim()
    .notEmpty().withMessage('Client email is required.')
    .isEmail().withMessage('Please provide a valid client email address.'),
  body('eventDate')
    .notEmpty().withMessage('Event date is required (YYYY-MM-DD).')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Event date must be formatted as YYYY-MM-DD.'),
  body('startTime')
    .notEmpty().withMessage('Start time is required (HH:mm).')
    .matches(/^\d{2}:\d{2}$/).withMessage('Start time must be formatted as HH:mm.'),
  body('packageId')
    .optional({ nullable: true })
    .trim(),
];

// feature: validate payment checkout payload
const payBookingValidator = [
  body('method')
    .optional()
    .isIn(['credit_card', 'bank_transfer', 'cash', 'stripe', 'plaid']).withMessage('Invalid payment method.'),
  body('paymentId')
    .optional({ nullable: true })
    .trim(),
];

// feature: validate cancellation payload
const cancelBookingValidator = [
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Cancellation reason cannot exceed 500 characters.'),
];

module.exports = {
  availabilityValidator,
  createBookingValidator,
  payBookingValidator,
  cancelBookingValidator,
};
