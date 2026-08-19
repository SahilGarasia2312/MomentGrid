'use strict';

const PaymentModel = require('../models/PaymentModel');
const Payment = require('../../../domain/entities/Payment');
const IPaymentRepository = require('../../../domain/repositories/IPaymentRepository');

class MongoPaymentRepository extends IPaymentRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Payment({
      id: doc._id ? doc._id.toString() : doc.id,
      clientEmail: doc.clientEmail,
      bookingId: doc.bookingId ? doc.bookingId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      invoiceNumber: doc.invoiceNumber,
      description: doc.description,
      amount: doc.amount,
      totalPackageAmount: doc.totalPackageAmount,
      advanceAmount: doc.advanceAmount,
      remainingAmount: doc.remainingAmount,
      amountPaid: doc.amountPaid,
      currency: doc.currency,
      status: doc.status,
      method: doc.method,
      paymentType: doc.paymentType,
      razorpayOrderId: doc.razorpayOrderId,
      razorpayPaymentId: doc.razorpayPaymentId,
      razorpaySignature: doc.razorpaySignature,
      invoiceItems: doc.invoiceItems || [],
      taxRate: doc.taxRate,
      transactions: doc.transactions || [],
      refunds: doc.refunds || [],
      dueDate: doc.dueDate,
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await PaymentModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByInvoiceNumber(invoiceNumber) {
    const doc = await PaymentModel.findOne({ invoiceNumber }).lean();
    return this._toDomain(doc);
  }

  async findByClientEmail(email) {
    const docs = await PaymentModel.find({ clientEmail: (email || '').toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async findByBookingId(bookingId) {
    const docs = await PaymentModel.find({ bookingId })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async findAll({ studioId = null, status = null, page = 1, limit = 50 } = {}) {
    const query = {};
    if (studioId) query.studioId = studioId;
    if (status && status !== 'all') query.status = status;

    const totalItems = await PaymentModel.countDocuments(query);
    const skip = (page - 1) * limit;
    const docs = await PaymentModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      items: docs.map((doc) => this._toDomain(doc)),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    };
  }

  async getAdminFinancialStats(studioId = null) {
    const matchStage = {};
    if (studioId) {
      matchStage.studioId = typeof studioId === 'string' ? studioId : studioId.toString();
    }

    const aggregation = await PaymentModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenueCollected: { $sum: '$amountPaid' },
          totalPackageVolume: { $sum: '$totalPackageAmount' },
          totalInvoicesCount: { $sum: 1 },
          paidInvoicesCount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] },
          },
          advancePaidCount: {
            $sum: { $cond: [{ $eq: ['$status', 'advance_paid'] }, 1, 0] },
          },
          overdueCount: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
          },
          refundedCount: {
            $sum: { $cond: [{ $in: ['$status', ['refunded', 'partial_refund']] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = aggregation[0] || {
      totalRevenueCollected: 0,
      totalPackageVolume: 0,
      totalInvoicesCount: 0,
      paidInvoicesCount: 0,
      advancePaidCount: 0,
      overdueCount: 0,
      refundedCount: 0,
    };

    // Also calculate outstanding balance due across active invoices
    const allActive = await PaymentModel.find({ ...matchStage, status: { $in: ['pending', 'advance_paid', 'overdue'] } }).lean();
    let totalOutstandingReceivables = 0;
    allActive.forEach((doc) => {
      const paymentObj = this._toDomain(doc);
      const bal = paymentObj.calculateBalanceDue();
      totalOutstandingReceivables += bal.balanceDue;
    });

    return {
      ...stats,
      totalOutstandingReceivables,
    };
  }

  async save(payment) {
    const doc = await PaymentModel.create({
      clientEmail: payment.clientEmail,
      bookingId: payment.bookingId,
      studioId: payment.studioId,
      invoiceNumber: payment.invoiceNumber,
      description: payment.description,
      totalPackageAmount: payment.totalPackageAmount,
      advanceAmount: payment.advanceAmount,
      remainingAmount: payment.remainingAmount,
      amountPaid: payment.amountPaid,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      paymentType: payment.paymentType,
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySignature: payment.razorpaySignature,
      invoiceItems: payment.invoiceItems,
      taxRate: payment.taxRate,
      transactions: payment.transactions,
      refunds: payment.refunds,
      dueDate: payment.dueDate,
      paidAt: payment.paidAt,
    });
    return this.findById(doc._id.toString());
  }

  async update(payment) {
    await PaymentModel.findByIdAndUpdate(
      payment.id,
      {
        $set: {
          clientEmail: payment.clientEmail,
          bookingId: payment.bookingId,
          studioId: payment.studioId,
          description: payment.description,
          totalPackageAmount: payment.totalPackageAmount,
          advanceAmount: payment.advanceAmount,
          remainingAmount: payment.remainingAmount,
          amountPaid: payment.amountPaid,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          paymentType: payment.paymentType,
          razorpayOrderId: payment.razorpayOrderId,
          razorpayPaymentId: payment.razorpayPaymentId,
          razorpaySignature: payment.razorpaySignature,
          invoiceItems: payment.invoiceItems,
          taxRate: payment.taxRate,
          transactions: payment.transactions,
          refunds: payment.refunds,
          dueDate: payment.dueDate,
          paidAt: payment.paidAt,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );
    return this.findById(payment.id);
  }

  async delete(id) {
    await PaymentModel.findByIdAndDelete(id);
    return true;
  }
}

module.exports = MongoPaymentRepository;
