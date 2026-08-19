'use strict';

/**
 * IBookingRepository — Pure Domain Interface
 *
 * Defines the contract for the Event Booking System module.
 * Decouples use cases from persistence details (e.g. MongoDB, external calendars).
 */
class IBookingRepository {
  /**
   * List active photography packages offered by a studio
   * @param {string} studioId
   * @returns {Promise<Array<Package>>}
   */
  async findActivePackagesByStudio(studioId) {
    throw new Error('Method not implemented: findActivePackagesByStudio');
  }

  /**
   * Find package by ID
   * @param {string} packageId
   * @returns {Promise<Package|null>}
   */
  async findPackageById(packageId) {
    throw new Error('Method not implemented: findPackageById');
  }

  /**
   * Compute open and booked calendar slots for a studio on a given date (YYYY-MM-DD)
   * feature: check existing Event clashes and Photographer blockedDates
   * @param {string} studioId
   * @param {string} dateString
   * @param {number} durationMinutes
   * @returns {Promise<Array<{ startTime: string, endTime: string, status: string }>>}
   */
  async findAvailableSlots(studioId, dateString, durationMinutes = 120) {
    throw new Error('Method not implemented: findAvailableSlots');
  }

  /**
   * Create a new booking event and its associated payment invoice transactionally
   * feature: atomic generation of Event + Payment invoice
   * @param {Event} eventEntity
   * @param {Payment} paymentEntity
   * @returns {Promise<{ event: Event, payment: Payment }>}
   */
  async createBookingWithInvoice(eventEntity, paymentEntity) {
    throw new Error('Method not implemented: createBookingWithInvoice');
  }

  /**
   * Find booking by ID with linked invoice and studio metadata
   * @param {string} bookingId
   * @returns {Promise<{ event: Event, payment: Payment|null, studio: object|null, packageData: object|null }>}
   */
  async findBookingByIdWithDetails(bookingId) {
    throw new Error('Method not implemented: findBookingByIdWithDetails');
  }

  /**
   * Update booking and invoice status when payment is processed
   * feature: checkout completion transition
   * @param {string} bookingId
   * @param {string} paymentId
   * @param {string} method
   * @returns {Promise<{ event: Event, payment: Payment }>}
   */
  async markBookingPaidAndConfirmed(bookingId, paymentId, method) {
    throw new Error('Method not implemented: markBookingPaidAndConfirmed');
  }

  /**
   * Cancel booking and process 48-hour refund policy on invoice
   * feature: cancellation policy engine
   * @param {string} bookingId
   * @param {string} cancellationReason
   * @param {string} newPaymentStatus — e.g. 'refunded' or 'retainer_forfeited'
   * @returns {Promise<{ event: Event, payment: Payment|null }>}
   */
  async cancelBookingWithPolicy(bookingId, cancellationReason, newPaymentStatus) {
    throw new Error('Method not implemented: cancelBookingWithPolicy');
  }

  /**
   * Retrieve notification log entries associated with a booking session
   * @param {string} bookingId
   * @returns {Promise<Array<object>>}
   */
  async findBookingNotifications(bookingId) {
    throw new Error('Method not implemented: findBookingNotifications');
  }
}

module.exports = IBookingRepository;
