'use strict';

const { body, param, query } = require('express-validator');

const createOrGetInvoiceValidator = [
  body('clientEmail')
    .notEmpty().withMessage('clientEmail is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .trim(),
  body('bookingId')
    .optional({ checkFalsy: true })
    .isMongoId().withMessage('bookingId must be a valid Mongo ObjectId.'),
  body('studioId')
    .optional({ checkFalsy: true })
    .isMongoId().withMessage('studioId must be a valid Mongo ObjectId.'),
  body('invoiceNumber').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('totalPackageAmount').optional().isNumeric().withMessage('totalPackageAmount must be numeric.'),
  body('advancePercentage').optional().isNumeric().withMessage('advancePercentage must be numeric.'),
  body('currency').optional().isString().trim(),
  body('invoiceItems').optional().isArray().withMessage('invoiceItems must be an array of item objects.'),
  body('taxRate').optional().isNumeric().withMessage('taxRate must be numeric.'),
];

const processRazorpayValidator = [
  param('id').isMongoId().withMessage('Payment ID must be a valid Mongo ObjectId.'),
  body('milestone')
    .optional()
    .isIn(['advance', 'remaining'])
    .withMessage('milestone must be advance or remaining.'),
  body('amount').optional().isNumeric(),
  body('method').optional().isString().trim(),
  body('razorpayPaymentId').notEmpty().withMessage('razorpayPaymentId is required.'),
  body('razorpayOrderId').optional().isString().trim(),
  body('razorpaySignature').notEmpty().withMessage('razorpaySignature is required for verification.'),
  body('note').optional().isString().trim(),
];

const initiateRefundValidator = [
  param('id').isMongoId().withMessage('Payment ID must be a valid Mongo ObjectId.'),
  body('amount').optional().isNumeric().withMessage('amount must be numeric if provided.'),
  body('reason').notEmpty().withMessage('reason is required to process a refund.').isString().trim(),
  body('initiatedBy').optional().isString().trim(),
];

const getClientHistoryValidator = [
  param('email').optional().isEmail().withMessage('Must be a valid email address.'),
  query('bookingId').optional({ checkFalsy: true }).isMongoId().withMessage('Must be a valid Mongo ObjectId.'),
  query('studioId').optional({ checkFalsy: true }).isMongoId().withMessage('Must be a valid Mongo ObjectId.'),
];

const getAdminReportsValidator = [
  query('studioId').optional({ checkFalsy: true }).isMongoId().withMessage('studioId must be a valid Mongo ObjectId.'),
];

module.exports = {
  createOrGetInvoiceValidator,
  processRazorpayValidator,
  initiateRefundValidator,
  getClientHistoryValidator,
  getAdminReportsValidator,
};
