'use strict';

const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['advance_deposit', 'remaining_balance', 'full_payment', 'refund'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'success' },
  method: { type: String, default: 'razorpay_upi' },
  razorpayPaymentId: { type: String, default: null },
  razorpayOrderId: { type: String, default: null },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const refundSchema = new mongoose.Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  initiatedBy: { type: String, default: 'system' },
  status: { type: String, default: 'processed' },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const paymentSchema = new mongoose.Schema(
  {
    clientEmail: {
      type: String,
      required: [true, 'Client email is required.'],
      lowercase: true,
      trim: true,
      index: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
      index: true,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      default: null,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: 'Photography Coverage & Master Heirloom Delivery Package',
    },
    totalPackageAmount: {
      type: Number,
      default: 0,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'advance_paid', 'paid', 'overdue', 'refunded', 'partial_refund'],
      default: 'pending',
      index: true,
    },
    method: {
      type: String,
      default: null,
    },
    paymentType: {
      type: String,
      enum: ['advance', 'remaining', 'full', 'refund'],
      default: 'full',
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    invoiceItems: {
      type: [invoiceItemSchema],
      default: [],
    },
    taxRate: {
      type: Number,
      default: 18,
    },
    transactions: {
      type: [transactionSchema],
      default: [],
    },
    refunds: {
      type: [refundSchema],
      default: [],
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 86400000),
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ clientEmail: 1, status: 1 });

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
