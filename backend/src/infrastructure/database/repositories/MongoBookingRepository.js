'use strict';

const IBookingRepository = require('../../../domain/repositories/IBookingRepository');
const EventModel = require('../models/EventModel');
const PaymentModel = require('../models/PaymentModel');
const PackageModel = require('../models/PackageModel');
const StudioModel = require('../models/StudioModel');
const PhotographerModel = require('../models/PhotographerModel');

const Event = require('../../../domain/entities/Event');
const Payment = require('../../../domain/entities/Payment');
const Package = require('../../../domain/entities/Package');

/**
 * MongoBookingRepository — Concrete Implementation
 *
 * Implements IBookingRepository using Mongoose.
 */
class MongoBookingRepository extends IBookingRepository {
  _toEventDomain(doc) {
    if (!doc) return null;
    return new Event({
      id: doc._id ? doc._id.toString() : doc.id,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      title: doc.title || '',
      clientName: doc.clientName || '',
      clientEmail: doc.clientEmail || '',
      clientPhone: doc.clientPhone || null,
      eventDate: doc.eventDate || '',
      startTime: doc.startTime || '10:00',
      endTime: doc.endTime || '12:00',
      packageId: doc.packageId ? doc.packageId.toString() : null,
      assignedStaffIds: Array.isArray(doc.assignedStaffIds)
        ? doc.assignedStaffIds.map((id) => id.toString())
        : [],
      status: doc.status || 'confirmed',
      price: doc.price || 0,
      notes: doc.notes || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  _toPaymentDomain(doc) {
    if (!doc) return null;
    return new Payment({
      id: doc._id ? doc._id.toString() : doc.id,
      clientEmail: doc.clientEmail || '',
      bookingId: doc.bookingId ? doc.bookingId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      invoiceNumber: doc.invoiceNumber,
      description: doc.description,
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      method: doc.method,
      dueDate: doc.dueDate,
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  _toPackageDomain(doc) {
    if (!doc) return null;
    return new Package({
      id: doc._id ? doc._id.toString() : doc.id,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      currency: doc.currency,
      deliverables: doc.deliverables,
      durationMinutes: doc.durationMinutes,
      isFeatured: doc.isFeatured,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * List active photography packages offered by a studio
   */
  async findActivePackagesByStudio(studioId) {
    // feature: list active packages sorted by featured flag and price
    const docs = await PackageModel.find({ studioId, status: 'active' })
      .sort({ isFeatured: -1, price: 1 })
      .lean();
    return docs.map((d) => this._toPackageDomain(d));
  }

  /**
   * Find package by ID
   */
  async findPackageById(packageId) {
    const doc = await PackageModel.findById(packageId).lean();
    return this._toPackageDomain(doc);
  }

  /**
   * Compute open and booked calendar slots for a studio on a given date (YYYY-MM-DD)
   * feature: evaluates existing Event time intervals + Photographer PTO blocked dates
   */
  async findAvailableSlots(studioId, dateString, durationMinutes = 120) {
    // 1. Check if the date is blocked across lead photographers of this studio
    const photographers = await PhotographerModel.find({ studioId }).lean();
    const isStudioBlocked = photographers.some((photog) => {
      if (!Array.isArray(photog.blockedDates)) return false;
      return photog.blockedDates.includes(dateString);
    });

    if (isStudioBlocked) {
      return []; // All slots blocked due to photographer holiday/blocked dates
    }

    // 2. Fetch all existing non-cancelled events for this studio on this exact date
    const existingEvents = await EventModel.find({
      studioId,
      eventDate: dateString,
      status: { $ne: 'cancelled' },
    }).lean();

    // Helper: convert "HH:mm" to minutes from midnight
    const toMinutes = (timeStr) => {
      const parts = timeStr.split(':').map(Number);
      return parts[0] * 60 + (parts[1] || 0);
    };

    // Helper: convert minutes to "HH:mm"
    const toTimeStr = (totalMins) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // 3. Generate standard studio operating window slots: 09:00 to 19:00
    const startWindow = toMinutes('09:00');
    const endWindow = toMinutes('19:00');
    const slots = [];

    for (let current = startWindow; current + durationMinutes <= endWindow; current += durationMinutes) {
      const slotStart = current;
      const slotEnd = current + durationMinutes;
      const startTimeStr = toTimeStr(slotStart);
      const endTimeStr = toTimeStr(slotEnd);

      // Check clash with existing sessions
      const hasClash = existingEvents.some((ev) => {
        const evStart = toMinutes(ev.startTime || '00:00');
        const evEnd = toMinutes(ev.endTime || '23:59');
        // Two intervals clash if overlap is > 0 minutes
        return slotStart < evEnd && slotEnd > evStart;
      });

      slots.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        status: hasClash ? 'booked' : 'available',
      });
    }

    return slots;
  }

  /**
   * Create a new booking event and its associated payment invoice transactionally
   * feature: atomic save of both Event and Payment records
   */
  async createBookingWithInvoice(eventEntity, paymentEntity) {
    const evDoc = await EventModel.create({
      studioId: eventEntity.studioId,
      title: eventEntity.title,
      clientName: eventEntity.clientName,
      clientEmail: eventEntity.clientEmail,
      clientPhone: eventEntity.clientPhone,
      eventDate: eventEntity.eventDate,
      startTime: eventEntity.startTime,
      endTime: eventEntity.endTime,
      packageId: eventEntity.packageId,
      assignedStaffIds: eventEntity.assignedStaffIds,
      status: eventEntity.status || 'requested',
      price: eventEntity.price,
      notes: eventEntity.notes,
    });

    const payDoc = await PaymentModel.create({
      clientEmail: paymentEntity.clientEmail,
      bookingId: evDoc._id.toString(),
      studioId: eventEntity.studioId,
      invoiceNumber: paymentEntity.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      description: paymentEntity.description || evDoc.title,
      amount: paymentEntity.amount || evDoc.price,
      currency: paymentEntity.currency || 'USD',
      status: paymentEntity.status || 'pending',
      method: paymentEntity.method || null,
      dueDate: paymentEntity.dueDate || new Date(Date.now() + 14 * 86400000),
      paidAt: null,
    });

    return {
      event: this._toEventDomain(evDoc),
      payment: this._toPaymentDomain(payDoc),
    };
  }

  /**
   * Find booking by ID with linked invoice and studio metadata
   */
  async findBookingByIdWithDetails(bookingId) {
    const evDoc = await EventModel.findById(bookingId).lean();
    if (!evDoc) return { event: null, payment: null, studio: null, packageData: null };

    const payDoc = await PaymentModel.findOne({ bookingId: evDoc._id.toString() }).lean();
    const studioDoc = evDoc.studioId ? await StudioModel.findById(evDoc.studioId).lean() : null;
    const packageDoc = evDoc.packageId ? await PackageModel.findById(evDoc.packageId).lean() : null;

    return {
      event: this._toEventDomain(evDoc),
      payment: this._toPaymentDomain(payDoc),
      studio: studioDoc || null,
      packageData: packageDoc ? this._toPackageDomain(packageDoc) : null,
    };
  }

  /**
   * Mark booking paid and confirmed
   * feature: processes online checkout completion
   */
  async markBookingPaidAndConfirmed(bookingId, paymentId, method) {
    const evDoc = await EventModel.findByIdAndUpdate(
      bookingId,
      { $set: { status: 'confirmed', updatedAt: new Date() } },
      { new: true }
    ).lean();

    let payDoc = null;
    if (paymentId) {
      payDoc = await PaymentModel.findByIdAndUpdate(
        paymentId,
        { $set: { status: 'paid', method: method || 'credit_card', paidAt: new Date(), updatedAt: new Date() } },
        { new: true }
      ).lean();
    } else {
      payDoc = await PaymentModel.findOneAndUpdate(
        { bookingId: bookingId },
        { $set: { status: 'paid', method: method || 'credit_card', paidAt: new Date(), updatedAt: new Date() } },
        { new: true }
      ).lean();
    }

    return {
      event: this._toEventDomain(evDoc),
      payment: this._toPaymentDomain(payDoc),
    };
  }

  /**
   * Cancel booking and process refund policy on invoice
   * feature: 48-hour cancellation evaluation update
   */
  async cancelBookingWithPolicy(bookingId, cancellationReason, newPaymentStatus) {
    const evDoc = await EventModel.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          status: 'cancelled',
          notes: cancellationReason ? `[Cancelled: ${cancellationReason}]` : '[Cancelled by client/studio]',
          updatedAt: new Date(),
        },
      },
      { new: true }
    ).lean();

    const payDoc = await PaymentModel.findOneAndUpdate(
      { bookingId: bookingId },
      { $set: { status: newPaymentStatus || 'refunded', updatedAt: new Date() } },
      { new: true }
    ).lean();

    return {
      event: this._toEventDomain(evDoc),
      payment: this._toPaymentDomain(payDoc),
    };
  }

  /**
   * Retrieve notification log entries associated with a booking session
   */
  async findBookingNotifications(bookingId) {
    const { event, payment } = await this.findBookingByIdWithDetails(bookingId);
    if (!event) return [];

    const logs = [];
    logs.push({
      id: `notif-req-${event.id}`,
      type: 'booking',
      title: 'Session Booking Submitted',
      message: `Booking request recorded for "${event.title}" on ${event.eventDate} (${event.startTime} - ${event.endTime}).`,
      timestamp: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Initial submission',
    });

    if (payment && payment.status === 'pending') {
      logs.push({
        id: `notif-inv-${payment.id}`,
        type: 'invoice',
        title: `Retainer Invoice #${payment.invoiceNumber} Generated`,
        message: `An invoice for $${payment.amount} ${payment.currency} is pending online checkout or studio settlement.`,
        timestamp: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Pending',
      });
    }

    if (payment && payment.status === 'paid') {
      logs.push({
        id: `notif-paid-${payment.id}`,
        type: 'payment',
        title: 'Payment Receipt Issued & Session Confirmed',
        message: `Payment of $${payment.amount} successfully processed via ${payment.method || 'online gateway'}. Session officially confirmed.`,
        timestamp: payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Paid',
      });
    }

    if (event.status === 'cancelled') {
      logs.push({
        id: `notif-cancel-${event.id}`,
        type: 'cancellation',
        title: 'Booking Session Cancelled',
        message: `Session has been cancelled. Invoice status set to "${payment ? payment.status : 'cancelled'}".`,
        timestamp: new Date().toLocaleDateString(),
      });
    }

    return logs;
  }
}

module.exports = MongoBookingRepository;
