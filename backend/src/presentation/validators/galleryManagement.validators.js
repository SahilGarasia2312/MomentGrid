'use strict';

const { body, query } = require('express-validator');

// feature: validate upload signature request
const uploadSignatureValidator = [
  body('folderPath')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Folder path cannot exceed 200 characters.'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array of strings.'),
];

// feature: validate photo addition payloads
const uploadPhotosValidator = [
  body('photos')
    .isArray({ min: 1 }).withMessage('Photos array is required and must contain at least 1 image payload.'),
  body('targetFolderId')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Category tag cannot exceed 50 characters.'),
];

// feature: validate folder operations
const manageFoldersValidator = [
  body('action')
    .notEmpty().withMessage('Action is required.')
    .isIn(['create', 'rename', 'delete', 'move_photos']).withMessage('Invalid folder action.'),
  body('folderPayload')
    .isObject().withMessage('folderPayload object is required.'),
];

// feature: validate search & filter query params
const searchAndFilterValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('category')
    .optional()
    .trim(),
  query('folderId')
    .optional()
    .trim(),
  query('searchQuery')
    .optional()
    .trim(),
];

// feature: validate watermark configuration
const applyWatermarkValidator = [
  body('watermarkConfig')
    .isObject().withMessage('watermarkConfig object is required.'),
];

// feature: validate sharing configuration
const configureSharingValidator = [
  body('sharingConfig')
    .isObject().withMessage('sharingConfig object is required.'),
];

module.exports = {
  uploadSignatureValidator,
  uploadPhotosValidator,
  manageFoldersValidator,
  searchAndFilterValidator,
  applyWatermarkValidator,
  configureSharingValidator,
};
