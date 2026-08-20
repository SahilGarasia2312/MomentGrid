'use strict';

const { body } = require('express-validator');

exports.teamAssignmentValidator = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').notEmpty().withMessage('Role is required')
];

exports.commentValidator = [
  body('text').notEmpty().withMessage('Comment text is required')
];
