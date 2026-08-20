'use strict';

const { body } = require('express-validator');

// Timeline
exports.timelineValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required')
];

// Tasks
exports.taskValidator = [
  body('task').notEmpty().withMessage('Task name is required')
];

// Shots
exports.shotValidator = [
  body('shot').notEmpty().withMessage('Shot name is required')
];

// Deliverables
exports.deliverableValidator = [
  body('title').notEmpty().withMessage('Deliverable title is required')
];
