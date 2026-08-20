'use strict';

const AppError = require('../../errors/AppError');

class UpdateEventDetailsUseCase {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, payload, actorId, actorRole) {
    if (actorRole === 'client') {
      throw new AppError('Clients cannot modify event details directly.', 403, 'FORBIDDEN');
    }

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found.', 404, 'EVENT_NOT_FOUND');
    }

    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Not assigned to this event.', 403, 'FORBIDDEN');
    }

    // Update allowed fields
    const allowedFields = [
      'title', 'eventType', 'description', 'eventDate', 'startTime', 'endTime', 
      'location', 'expectedGuestCount', 'packageId', 'assignedStaffIds', 
      'price', 'notes', 'internalNotes'
    ];

    allowedFields.forEach(field => {
      if (payload[field] !== undefined) {
        event[field] = payload[field];
      }
    });

    event.validate();

    return this.eventRepository.update(event);
  }
}

module.exports = UpdateEventDetailsUseCase;
