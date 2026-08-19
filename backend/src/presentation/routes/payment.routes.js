'use strict';

const express = require('express');
const router = express.Router();

const PaymentController = require('../controllers/PaymentController');
const {
  createOrGetInvoiceValidator,
  processRazorpayValidator,
  initiateRefundValidator,
  getClientHistoryValidator,
  getAdminReportsValidator,
} = require('../validators/payment.validators');

// POST /v1/payments/invoices — Create or retrieve booking itemized invoice
router.post(
  '/invoices',
  createOrGetInvoiceValidator,
  PaymentController.createOrGetInvoice.bind(PaymentController)
);

// POST /v1/payments/:id/razorpay — Verify & record Razorpay Advance/Remaining checkout
router.post(
  '/:id/razorpay',
  processRazorpayValidator,
  PaymentController.processRazorpayPayment.bind(PaymentController)
);

// POST /v1/payments/:id/refund — Initiate full or partial refund
router.post(
  '/:id/refund',
  initiateRefundValidator,
  PaymentController.initiateRefund.bind(PaymentController)
);

// GET /v1/payments/client/:email — Get client invoice & transaction history
router.get(
  '/client/:email',
  getClientHistoryValidator,
  PaymentController.getClientHistory.bind(PaymentController)
);

// GET /v1/payments/admin/reports — Get comprehensive studio financial reports
router.get(
  '/admin/reports',
  getAdminReportsValidator,
  PaymentController.getAdminReports.bind(PaymentController)
);

module.exports = router;
