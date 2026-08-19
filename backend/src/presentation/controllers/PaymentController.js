'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repositories
const MongoPaymentRepository = require('../../infrastructure/database/repositories/MongoPaymentRepository');

// Use Cases
const CreateOrGetPaymentInvoiceUseCase = require('../../application/usecases/payment/CreateOrGetPaymentInvoiceUseCase');
const ProcessRazorpayPaymentUseCase = require('../../application/usecases/payment/ProcessRazorpayPaymentUseCase');
const InitiatePaymentRefundUseCase = require('../../application/usecases/payment/InitiatePaymentRefundUseCase');
const GetClientPaymentHistoryUseCase = require('../../application/usecases/payment/GetClientPaymentHistoryUseCase');
const GetAdminFinancialReportsUseCase = require('../../application/usecases/payment/GetAdminFinancialReportsUseCase');

const paymentRepository = new MongoPaymentRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * PaymentController
 *
 * REST controller handling invoice creation, Advance / Remaining Razorpay checkout verification,
 * dispute / refund initiation, client financial logs, and studio executive analytics.
 */
class PaymentController {
  async createOrGetInvoice(req, res, next) {
    try {
      assertValid(req);
      const {
        clientEmail,
        bookingId,
        studioId,
        invoiceNumber,
        description,
        totalPackageAmount,
        advancePercentage,
        currency,
        invoiceItems,
        taxRate,
      } = req.body;

      const useCase = new CreateOrGetPaymentInvoiceUseCase({ paymentRepository });
      const invoice = await useCase.execute({
        clientEmail,
        bookingId,
        studioId,
        invoiceNumber,
        description,
        totalPackageAmount,
        advancePercentage,
        currency,
        invoiceItems,
        taxRate,
      });

      return res.status(200).json({
        success: true,
        message: 'Payment invoice retrieved or created successfully.',
        data: invoice,
      });
    } catch (err) {
      next(err);
    }
  }

  async processRazorpayPayment(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const {
        milestone,
        amount,
        method,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        note,
      } = req.body;

      const useCase = new ProcessRazorpayPaymentUseCase({ paymentRepository });
      const updated = await useCase.execute({
        paymentId: id,
        milestone,
        amount,
        method,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        note,
      });

      return res.status(200).json({
        success: true,
        message: `Razorpay payment successfully verified and recorded (${milestone || 'advance'}).`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async initiateRefund(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { amount, reason, initiatedBy } = req.body;

      const useCase = new InitiatePaymentRefundUseCase({ paymentRepository });
      const updated = await useCase.execute({
        paymentId: id,
        amount,
        reason,
        initiatedBy,
      });

      return res.status(200).json({
        success: true,
        message: 'Payment refund processed and logged successfully.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getClientHistory(req, res, next) {
    try {
      assertValid(req);
      const { email } = req.params;
      const { bookingId, studioId, status, page, limit } = req.query;

      const useCase = new GetClientPaymentHistoryUseCase({ paymentRepository });
      const history = await useCase.execute({
        clientEmail: email,
        bookingId,
        studioId,
        status,
        page: Number(page || 1),
        limit: Number(limit || 50),
      });

      return res.status(200).json({
        success: true,
        message: 'Client payment history retrieved successfully.',
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAdminReports(req, res, next) {
    try {
      assertValid(req);
      const studioId = req.user ? req.user.studioId : req.query.studioId;

      const useCase = new GetAdminFinancialReportsUseCase({ paymentRepository });
      const reports = await useCase.execute({ studioId });

      return res.status(200).json({
        success: true,
        message: 'Studio financial executive reports aggregated successfully.',
        data: reports,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PaymentController();
