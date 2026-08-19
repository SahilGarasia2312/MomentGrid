'use strict';

const AppError = require('../../errors/AppError');
const Event = require('../../../domain/entities/Event');

class ListEventsUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute({ studioId, staffId }) {
    if (staffId) {
      return await this.eventRepository.findByStaffId(staffId);
    }
    return await this.eventRepository.findByStudioId(studioId);
  }
}

class CreateEventUseCase {
  constructor(eventRepository, packageRepository) {
    this.eventRepository = eventRepository;
    this.packageRepository = packageRepository;
  }

  async execute({ studioId, title, clientName, clientEmail, clientPhone, eventDate, startTime, endTime, packageId, assignedStaffIds, price, notes }) {
    let finalPrice = Number(price) || 0;
    if (packageId && !finalPrice) {
      const pkg = await this.packageRepository.findById(packageId);
      if (pkg) finalPrice = pkg.price;
    }

    const event = new Event({
      studioId,
      title,
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      startTime,
      endTime,
      packageId,
      assignedStaffIds: assignedStaffIds || [],
      status: Event.STATUSES.CONFIRMED,
      price: finalPrice,
      notes,
    });

    return await this.eventRepository.save(event);
  }
}

class UpdateEventStatusUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute({ eventId, studioId, status, assignedStaffIds, title, eventDate, startTime, endTime, notes }) {
    const event = await this.eventRepository.findById(eventId);
    if (!event || event.studioId !== studioId) {
      throw new AppError('Event not found in this studio.', 404, 'EVENT_NOT_FOUND');
    }

    if (status !== undefined) event.status = status;
    if (assignedStaffIds !== undefined) event.assignedStaffIds = assignedStaffIds;
    if (title !== undefined) event.title = title;
    if (eventDate !== undefined) event.eventDate = eventDate;
    if (startTime !== undefined) event.startTime = startTime;
    if (endTime !== undefined) event.endTime = endTime;
    if (notes !== undefined) event.notes = notes;

    return await this.eventRepository.update(event);
  }
}

class DeleteEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute({ eventId, studioId }) {
    const event = await this.eventRepository.findById(eventId);
    if (!event || event.studioId !== studioId) {
      throw new AppError('Event not found in this studio.', 404, 'EVENT_NOT_FOUND');
    }

    await this.eventRepository.delete(eventId);
    return { success: true, message: 'Event cancelled and deleted successfully.' };
  }
}

module.exports = {
  ListEventsUseCase,
  CreateEventUseCase,
  UpdateEventStatusUseCase,
  DeleteEventUseCase,
};
