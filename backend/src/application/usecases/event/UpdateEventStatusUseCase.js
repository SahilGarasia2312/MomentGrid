'use strict';

const AppError = require('../../errors/AppError');

class UpdateEventStatusUseCase {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, newStatus, actorId, actorRole) {
    if (actorRole === 'client') {
      throw new AppError('Clients cannot change event status.', 403, 'FORBIDDEN');
    }

    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found.', 404, 'EVENT_NOT_FOUND');
    }

    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Not assigned to this event.', 403, 'FORBIDDEN');
    }

    event.transitionTo(newStatus);
    return this.eventRepository.update(event);
  }
}

module.exports = UpdateEventStatusUseCase;
