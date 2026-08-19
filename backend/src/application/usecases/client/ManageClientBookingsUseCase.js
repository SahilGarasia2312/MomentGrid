'use strict';

const AppError = require('../../errors/AppError');
const Event = require('../../../domain/entities/Event');

class ManageClientBookingsUseCase {
  constructor(clientRepository, studioRepository) {
    this.clientRepository = clientRepository;
    this.studioRepository = studioRepository;
  }

  async listBookings({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to list bookings.', 400, 'CLIENT_EMAIL_REQUIRED');
    }
    return this.clientRepository.findBookingsByClientEmail(clientEmail);
  }

  async requestBooking({ clientEmail, clientName, clientPhone, studioId, title, eventDate, startTime, endTime, notes }) {
    if (!clientEmail || !title || !eventDate || !startTime || !endTime) {
      throw new AppError('Title, date, and times are required for booking requests.', 400, 'VALIDATION_ERROR');
    }

    // Default studio resolution if not provided
    let targetStudioId = studioId;
    if (!targetStudioId) {
      // Find any active studio or default to first studio
      const studios = await this.studioRepository.findAll ? await this.studioRepository.findAll() : [];
      if (studios.length > 0) {
        targetStudioId = studios[0].id;
      } else {
        throw new AppError('No active studio available to receive booking.', 400, 'NO_STUDIO_AVAILABLE');
      }
    }

    const newBooking = new Event({
      studioId: targetStudioId,
      title: title.trim(),
      clientName: clientName || clientEmail.split('@')[0],
      clientEmail: clientEmail.toLowerCase().trim(),
      clientPhone: clientPhone || null,
      eventDate,
      startTime,
      endTime,
      status: 'requested',
      price: 500, // standard retainer quote estimate
      notes: notes || 'Online client session request via VIP Portal',
    });

    return this.clientRepository.createBooking(newBooking);
  }
}

module.exports = ManageClientBookingsUseCase;
