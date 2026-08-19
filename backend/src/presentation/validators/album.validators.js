'use strict';

const { body, param } = require('express-validator');

const createOrGetDraftValidator = [
  body('clientEmail')
    .notEmpty().withMessage('clientEmail is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .trim(),
  body('galleryId')
    .optional({ checkFalsy: true })
    .isMongoId().withMessage('galleryId must be a valid Mongo ObjectId.'),
  body('clientName')
    .optional()
    .isString()
    .trim(),
  body('title')
    .optional()
    .isString()
    .trim(),
  body('initialPhotoIds')
    .optional()
    .isArray().withMessage('initialPhotoIds must be an array of string photo IDs.'),
];

const updateSelectionValidator = [
  param('id').isMongoId().withMessage('Album ID must be a valid Mongo ObjectId.'),
  body('action')
    .notEmpty().withMessage('action is required.')
    .isIn(['toggle_favorite', 'toggle_reject', 'set_order'])
    .withMessage('action must be one of: toggle_favorite, toggle_reject, set_order.'),
  body('photoId')
    .if(body('action').isIn(['toggle_favorite', 'toggle_reject']))
    .notEmpty().withMessage('photoId is required when toggling favorite or reject.'),
  body('orderedPhotoIds')
    .if(body('action').equals('set_order'))
    .isArray().withMessage('orderedPhotoIds must be an array of photo IDs when setting order.'),
];

const addCommentValidator = [
  param('id').isMongoId().withMessage('Album ID must be a valid Mongo ObjectId.'),
  body('photoId').notEmpty().withMessage('photoId is required.'),
  body('comment').isString().withMessage('comment must be a string.'),
  body('clientName').optional().isString().trim(),
];

const configureCoverValidator = [
  param('id').isMongoId().withMessage('Album ID must be a valid Mongo ObjectId.'),
  body('albumSize').optional().isString().trim(),
  body('pageCount').optional().isInt({ min: 10, max: 150 }).withMessage('pageCount must be between 10 and 150.'),
  body('coverSpecs').optional().isObject().withMessage('coverSpecs must be an object.'),
  body('clientNotes').optional().isString().trim(),
];

const submitAlbumValidator = [
  param('id').isMongoId().withMessage('Album ID must be a valid Mongo ObjectId.'),
];

const getStudioManifestValidator = [
  param('id').isMongoId().withMessage('Album ID must be a valid Mongo ObjectId.'),
];

module.exports = {
  createOrGetDraftValidator,
  updateSelectionValidator,
  addCommentValidator,
  configureCoverValidator,
  submitAlbumValidator,
  getStudioManifestValidator,
};
