'use strict';

const Event = require('../../../domain/entities/Event');
const AppError = require('../../errors/AppError');

class CreateEventUseCase {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
  }

  async execute(payload, actorRole, actorId) {
    if (!payload.studioId) {
      throw new AppError('Studio ID is required to create an event.', 400, 'STUDIO_ID_REQUIRED');
    }

    if (actorRole !== 'admin' && actorRole !== 'studio_owner' && actorRole !== 'photographer') {
      throw new AppError('Not authorized to create events.', 403, 'FORBIDDEN');
    }

    const event = new Event({
      ...payload,
      status: Event.STATUSES.DRAFT,
    });

    return this.eventRepository.save(event);
  }
}

module.exports = CreateEventUseCase;
