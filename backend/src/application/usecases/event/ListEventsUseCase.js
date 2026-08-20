'use strict';

class ListEventsUseCase {
  constructor({ eventRepository }) {
    this.eventRepository = eventRepository;
  }

  async execute(filters, actorId, actorRole) {
    const query = {};

    if (actorRole === 'client') {
      query.clientId = actorId;
    } else if (actorRole === 'photographer') {
      query.assignedStaffIds = actorId;
    } else if (actorRole === 'studio_owner' && filters.studioId) {
      query.studioId = filters.studioId;
    }

    if (filters.status) query.status = filters.status;
    if (filters.startDate && filters.endDate) {
      query.eventDate = { $gte: filters.startDate, $lte: filters.endDate };
    } else if (filters.startDate) {
      query.eventDate = { $gte: filters.startDate };
    }

    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;

    return this.eventRepository.searchAndFilter(query, { page, limit, sort: { eventDate: -1 } });
  }
}

module.exports = ListEventsUseCase;
