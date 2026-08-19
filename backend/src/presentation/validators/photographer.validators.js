'use strict';

const { body, query } = require('express-validator');

const updateProfileValidator = [
  body('bio').optional().isString().isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters.'),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be valid.'),
  body('portfolioUrl').optional().isURL().withMessage('Portfolio URL must be valid.'),
  body('specializations').optional().isArray().withMessage('Specializations must be an array of strings.'),
  body('yearsExperience').optional().isInt({ min: 0, max: 60 }).withMessage('Years of experience must be between 0 and 60.'),
  body('availability').optional().isObject().withMessage('Availability must be an object with day keys.'),
  body('portfolioItems').optional().isArray().withMessage('Portfolio items must be an array.'),
];

const blockDatesValidator = [
  body('dates').isArray({ min: 1 }).withMessage('Dates array must contain at least 1 date string (YYYY-MM-DD).'),
  body('action').optional().isIn(['block', 'unblock']).withMessage('Action must be either "block" or "unblock".'),
];

const availabilityQueryValidator = [
  query('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must be in YYYY-MM format.'),
];

const uploadGalleryValidator = [
  body('title').notEmpty().withMessage('Gallery title is required.').isLength({ max: 150 }),
  body('pinCode').notEmpty().matches(/^\d{4}$/).withMessage('PIN code must be exactly 4 digits.'),
  body('eventId').optional({ nullable: true }).isMongoId().withMessage('Event ID must be valid.'),
  body('packageId').optional({ nullable: true }).isMongoId().withMessage('Package ID must be valid.'),
  body('clientEmail').optional().isEmail().withMessage('Client email must be valid.'),
  body('photos').optional().isArray().withMessage('Photos must be an array.'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published.'),
];

module.exports = {
  updateProfileValidator,
  blockDatesValidator,
  availabilityQueryValidator,
  uploadGalleryValidator,
};
