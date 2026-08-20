'use strict';

const AppError = require('../../errors/AppError');
const EventTeamAssignment = require('../../../domain/entities/collaboration/EventTeamAssignment');
const EventActivity = require('../../../domain/entities/collaboration/EventActivity');
const EventComment = require('../../../domain/entities/collaboration/EventComment');

class CollaborationUseCases {
  constructor({ collaborationRepository, eventRepository, staffRepository }) {
    this.collaborationRepository = collaborationRepository;
    this.eventRepository = eventRepository;
    this.staffRepository = staffRepository;
  }

  async _verifyEventAccess(eventId, actorId, actorRole) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError('Event not found.', 404, 'EVENT_NOT_FOUND');
    return event;
  }

  // --- Team Assignment ---
  async assignTeamMember(eventId, userId, role, actorId, actorRole) {
    const event = await this._verifyEventAccess(eventId, actorId, actorRole);
    
    // Authorization: only studio_owner or admin or already assigned staff can assign
    if (actorRole === 'client') throw new AppError('Forbidden.', 403, 'FORBIDDEN');
    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN');
    }

    // Cross-studio check: verify the target userId belongs to the event's studio
    const studioStaff = await this.staffRepository.findByStudioId(event.studioId);
    const targetStaff = studioStaff.find(s => s.userId === userId);
    if (!targetStaff) {
      throw new AppError('Cannot assign user from outside the studio.', 403, 'CROSS_STUDIO_ASSIGNMENT_FORBIDDEN');
    }

    const assignment = new EventTeamAssignment({
      eventId,
      userId,
      role,
      assignedBy: actorId
    });

    const result = await this.collaborationRepository.addTeamMember(assignment);

    // Sync denormalized array in Event for quick authorization
    if (!event.assignedStaffIds.includes(userId)) {
      event.assignedStaffIds.push(userId);
      await this.eventRepository.update(event);
    }

    // Log activity
    await this.logActivity(eventId, `${assignment.role} assigned to event`, actorId);

    return result;
  }

  async getTeam(eventId, actorId, actorRole) {
    await this._verifyEventAccess(eventId, actorId, actorRole);
    return this.collaborationRepository.getTeam(eventId);
  }

  // --- Activity History ---
  async logActivity(eventId, action, actorId = null, actorName = 'System', metadata = {}) {
    const activity = new EventActivity({ eventId, action, actorId, actorName, metadata });
    return this.collaborationRepository.logActivity(activity);
  }

  async getActivityLog(eventId, actorId, actorRole) {
    if (actorRole === 'client') throw new AppError('Clients cannot view activity history.', 403, 'FORBIDDEN');
    const event = await this._verifyEventAccess(eventId, actorId, actorRole);
    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN');
    }
    return this.collaborationRepository.getActivityLog(eventId);
  }

  // --- Internal Comments ---
  async addComment(eventId, text, actorId, actorName, actorRole) {
    if (actorRole === 'client') throw new AppError('Clients cannot post internal comments.', 403, 'FORBIDDEN');
    const event = await this._verifyEventAccess(eventId, actorId, actorRole);
    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN');
    }

    const comment = new EventComment({
      eventId,
      authorId: actorId,
      authorName,
      text
    });
    return this.collaborationRepository.addComment(comment);
  }

  async getComments(eventId, actorId, actorRole) {
    if (actorRole === 'client') throw new AppError('Clients cannot view internal comments.', 403, 'FORBIDDEN');
    const event = await this._verifyEventAccess(eventId, actorId, actorRole);
    if (actorRole === 'photographer' && !event.assignedStaffIds.includes(actorId)) {
      throw new AppError('Forbidden: Not assigned to this event.', 403, 'FORBIDDEN');
    }
    return this.collaborationRepository.getComments(eventId);
  }
}

module.exports = CollaborationUseCases;
