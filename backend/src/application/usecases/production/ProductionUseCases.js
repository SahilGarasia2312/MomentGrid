'use strict';

const AppError = require('../../errors/AppError');
const EventTimelineItem = require('../../../domain/entities/production/EventTimelineItem');
const EventTask = require('../../../domain/entities/production/EventTask');
const EventShot = require('../../../domain/entities/production/EventShot');
const EventDeliverable = require('../../../domain/entities/production/EventDeliverable');

class ProductionUseCases {
  constructor({ productionRepository, eventRepository, collaborationRepository }) {
    this.productionRepository = productionRepository;
    this.eventRepository = eventRepository;
    this.collaborationRepository = collaborationRepository;
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

  async _log(eventId, action, actorId) {
    if (this.collaborationRepository) {
      const EventActivity = require('../../../domain/entities/collaboration/EventActivity');
      const activity = new EventActivity({ eventId, action, actorId });
      await this.collaborationRepository.logActivity(activity);
    }
  }

  async _validateAssignee(eventId, assigneeId) {
    if (assigneeId && this.collaborationRepository) {
      const inTeam = await this.collaborationRepository.isUserInTeam(eventId, assigneeId);
      if (!inTeam) throw new AppError('Assignee must be an authorized event team member.', 400, 'INVALID_ASSIGNEE');
    }
  }

  // --- Timeline ---
  async getTimeline(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, true);
    return this.productionRepository.getTimeline(eventId);
  }
  async addTimelineItem(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Clients can't add
    const item = new EventTimelineItem({ ...payload, eventId });
    const result = await this.productionRepository.addTimelineItem(item);
    await this._log(eventId, `Timeline item created: ${item.title}`, actorId);
    return result;
  }
  async updateTimelineItem(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const result = await this.productionRepository.updateTimelineItem(itemId, payload);
    await this._log(eventId, `Timeline item updated`, actorId);
    return result;
  }
  async removeTimelineItem(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeTimelineItem(itemId);
    await this._log(eventId, `Timeline item removed`, actorId);
  }

  // --- Tasks ---
  async getTasks(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Client forbidden
    return this.productionRepository.getTasks(eventId);
  }
  async addTask(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this._validateAssignee(eventId, payload.assigneeId);
    const item = new EventTask({ ...payload, eventId });
    const result = await this.productionRepository.addTask(item);
    await this._log(eventId, `Task created: ${item.task}`, actorId);
    return result;
  }
  async updateTask(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this._validateAssignee(eventId, payload.assigneeId);
    const result = await this.productionRepository.updateTask(itemId, payload);
    await this._log(eventId, `Task updated`, actorId);
    return result;
  }
  async removeTask(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeTask(itemId);
    await this._log(eventId, `Task removed`, actorId);
  }

  // --- Shots ---
  async getShots(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false); // Client forbidden
    return this.productionRepository.getShots(eventId);
  }
  async addShot(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this._validateAssignee(eventId, payload.assignedPhotographerId);
    const item = new EventShot({ ...payload, eventId });
    const result = await this.productionRepository.addShot(item);
    await this._log(eventId, `Shot created: ${item.shot}`, actorId);
    return result;
  }
  async updateShot(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this._validateAssignee(eventId, payload.assignedPhotographerId);
    const result = await this.productionRepository.updateShot(itemId, payload);
    await this._log(eventId, `Shot updated`, actorId);
    return result;
  }
  async removeShot(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeShot(itemId);
    await this._log(eventId, `Shot removed`, actorId);
  }

  // --- Deliverables ---
  async getDeliverables(eventId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, true); // Client allowed
    return this.productionRepository.getDeliverables(eventId);
  }
  async addDeliverable(eventId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const item = new EventDeliverable({ ...payload, eventId });
    const result = await this.productionRepository.addDeliverable(item);
    await this._log(eventId, `Deliverable created: ${item.title}`, actorId);
    return result;
  }
  async updateDeliverable(eventId, itemId, payload, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    const result = await this.productionRepository.updateDeliverable(itemId, payload);
    await this._log(eventId, `Deliverable updated`, actorId);
    return result;
  }
  async removeDeliverable(eventId, itemId, actorId, actorRole) {
    await this._verifyAccess(eventId, actorId, actorRole, false);
    await this.productionRepository.removeDeliverable(itemId);
    await this._log(eventId, `Deliverable removed`, actorId);
  }
}

module.exports = ProductionUseCases;
