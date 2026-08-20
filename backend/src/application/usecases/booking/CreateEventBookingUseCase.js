'use strict';

const Event = require('../../../domain/entities/Event');
const Payment = require('../../../domain/entities/Payment');
const AppError = require('../../errors/AppError');

/**
 * CreateEventBookingUseCase
 *
 * Atomically creates a new photography session booking and generates a pending retainer invoice.
 */
class CreateEventBookingUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {object} dto
   * @param {string} dto.studioId
   * @param {string} dto.clientName
   * @param {string} dto.clientEmail
   * @param {string|null} dto.clientPhone
   * @param {string} dto.eventDate
   * @param {string} dto.startTime
   * @param {string} dto.endTime
   * @param {string|null} dto.packageId
   * @param {string|null} dto.notes
   */
  async execute(dto) {
    if (!dto.studioId || !dto.clientName || !dto.clientEmail || !dto.eventDate || !dto.startTime) {
      throw new AppError(
        'Studio ID, Client Name, Email, Event Date, and Start Time are required.',
        400,
        'MISSING_REQUIRED_FIELDS'
      );
    }

    // 1. Double check that the requested time slot is not already booked
    const slots = await this.bookingRepository.findAvailableSlots(dto.studioId, dto.eventDate, 60);
    const targetSlot = slots.find((s) => s.startTime === dto.startTime);
    if (targetSlot && targetSlot.status === 'booked') {
      throw new AppError(
        'The requested time slot is no longer available on the calendar.',
        409,
        'SLOT_NOT_AVAILABLE'
      );
    }

    // 2. Resolve package price and duration
    let price = 0;
    let title = 'Custom Photography Session';
    let endTime = dto.endTime || '12:00';

    if (dto.packageId) {
      const pkg = await this.bookingRepository.findPackageById(dto.packageId);
      if (pkg) {
        price = pkg.price;
        title = pkg.title;
        // Compute end time based on duration if not explicitly passed
        const parts = dto.startTime.split(':').map(Number);
        const totalMins = parts[0] * 60 + (parts[1] || 0) + (pkg.durationMinutes || 120);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        endTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
    }

    // 3. Construct domain entities
    const eventEntity = new Event({
      studioId: dto.studioId,
      title: title,
      clientName: dto.clientName,
      clientEmail: dto.clientEmail,
      clientPhone: dto.clientPhone || null,
      eventDate: dto.eventDate,
      startTime: dto.startTime,
      endTime: endTime,
      packageId: dto.packageId || null,
      status: Event.STATUSES.REQUESTED,
      price: price,
      notes: dto.notes || '',
    });

    const paymentEntity = new Payment({
      clientEmail: dto.clientEmail,
      studioId: dto.studioId,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      description: `Retainer & Session Fee: ${title} (${dto.eventDate})`,
      amount: price > 0 ? price : 500, // Default minimum retainer if custom session
      currency: 'USD',
      status: Payment.STATUSES.PENDING,
      dueDate: new Date(Date.now() + 7 * 86400000), // Due within 7 days
    });

    // feature: atomic save of both booking session and invoice
    return await this.bookingRepository.createBookingWithInvoice(eventEntity, paymentEntity);
  }
}

module.exports = CreateEventBookingUseCase;
