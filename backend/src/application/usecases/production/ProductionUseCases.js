'use strict';

const AppError = require('../../errors/AppError');
const EventTimelineItem = require('../../../domain/entities/production/EventTimelineItem');
const EventTask = require('../../../domain/entities/production/EventTask');
const EventShot = require('../../../domain/entities/production/EventShot');
const EventDeliverable = require('../../../domain/entities/production/EventDeliverable');

class ProductionUseCases {
  constructor({ productionRepository, eventRepository }) {
    this.productionRepository = productionRepository;
    this.eventRepository = eventRepository;
  }

  async _verifyAccess(eventId, actorId, actorRole, isClientAllowed = false) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found.', 404, 'EVENT_NOT_FOUND');

    if (actorRole === 'client') {
      if (!isClientAllowed) throw new AppError('Forbidden: Clients cannot access this resource.', 403, 'FORBIDDEN');
      if (event.clientId !== actorId && event.clientEmail !== actorId) {
        throw new AppError('Forbidden: Not your event.', 403, 'FORBIDDEN');
      }
    } else if (actorRole === 'photographer') {
      if (!event.assignedStaffIds.includes(actorId)) {
        throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN');
      }
    }
    return event;
  }

  // --- Timeline ---
  async getTimeline(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, true);
    return this.productionRepository.getTimeline(eventId);
  }
  async addTimelineItem(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Clients can't add
    const item = new EventTimelineItem({ ...payload, eventId });
    return this.productionRepository.addTimelineItem(item);
  }
  async updateTimelineItem(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    return this.productionRepository.updateTimelineItem(itemId, payload);
  }
  async removeTimelineItem(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeTimelineItem(itemId);
  }

  // --- Tasks ---
  async getTasks(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Client forbidden
    return this.productionRepository.getTasks(eventId);
  }
  async addTask(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const item = new EventTask({ ...payload, eventId });
    return this.productionRepository.addTask(item);
  }
  async updateTask(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    return this.productionRepository.updateTask(itemId, payload);
  }
  async removeTask(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeTask(itemId);
  }

  // --- Shots ---
  async getShots(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Client forbidden
    return this.productionRepository.getShots(eventId);
  }
  async addShot(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const item = new EventShot({ ...payload, eventId });
    return this.productionRepository.addShot(item);
  }
  async updateShot(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    return this.productionRepository.updateShot(itemId, payload);
  }
  async removeShot(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeShot(itemId);
  }

  // --- Deliverables ---
  async getDeliverables(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, true); // Client allowed
    return this.productionRepository.getDeliverables(eventId);
  }
  async addDeliverable(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const item = new EventDeliverable({ ...payload, eventId });
    return this.productionRepository.addDeliverable(item);
  }
  async updateDeliverable(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    return this.productionRepository.updateDeliverable(itemId, payload);
  }
  async removeDeliverable(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeDeliverable(itemId);
  }
}

module.exports = ProductionUseCases;
