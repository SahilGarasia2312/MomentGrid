'use strict';

const AppError = require('../../errors/AppError');

class GetEventDetailsUseCase {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, actorId, actorRole) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found.', 404, 'EVENT_NOT_FOUND');
    }

    if (actorRole === 'client') {
      if (event.clientId !== actorId && event.clientEmail !== actorId) { // Just in case clientEmail is used as identifier if no ID
        // Client can only view their own events
        throw new AppError('Forbidden: Not your event.', 403, 'FORBIDDEN_RESOURCE');
      }
    } else if (actorRole === 'photographer') {
      // Photographer must be assigned or be owner of studio
      if (!event.assignedStaffIds.includes(actorId)) {
        throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN_RESOURCE');
      }
    } else if (actorRole !== 'studio_owner' && actorRole !== 'admin') {
      throw new AppError('Forbidden: Access denied.', 403, 'FORBIDDEN_RESOURCE');
    }

    return event;
  }
}

module.exports = GetEventDetailsUseCase;
