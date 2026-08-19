'use strict';

const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Studio name must be between 2 and 100 characters.'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9\-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens.'),
  body('contactEmail')
    .optional({ nullable: true })
    .isEmail().withMessage('Please provide a valid contact email.'),
];

const addStaffValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Staff full name is required.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Staff email is required.')
    .isEmail().withMessage('Please provide a valid email address.'),
  body('role')
    .optional()
    .isIn(['lead_photographer', 'second_shooter', 'editor', 'assistant']).withMessage('Invalid staff role.'),
];

const packageValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Package title is required.'),
  body('price')
    .notEmpty().withMessage('Price is required.')
    .isNumeric().withMessage('Price must be a number.'),
  body('durationMinutes')
    .optional()
    .isNumeric().withMessage('Duration must be a number in minutes.'),
];

const eventValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required.'),
  body('clientName')
    .trim()
    .notEmpty().withMessage('Client name is required.'),
  body('clientEmail')
    .trim()
    .notEmpty().withMessage('Client email is required.')
    .isEmail().withMessage('Please provide a valid client email.'),
  body('eventDate')
    .notEmpty().withMessage('Event date is required (YYYY-MM-DD).'),
  body('startTime')
    .notEmpty().withMessage('Start time is required (HH:mm).'),
  body('endTime')
    .notEmpty().withMessage('End time is required (HH:mm).'),
];

const galleryValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Gallery title is required.'),
  body('clientEmail')
    .trim()
    .notEmpty().withMessage('Client email is required.')
    .isEmail().withMessage('Please provide a valid client email.'),
];

const reviewValidator = [
  body('clientName')
    .trim()
    .notEmpty().withMessage('Client name is required.'),
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
];

module.exports = {
  updateProfileValidator,
  addStaffValidator,
  packageValidator,
  eventValidator,
  galleryValidator,
  reviewValidator,
};
