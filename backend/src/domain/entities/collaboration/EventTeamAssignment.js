'use strict';

const AppError = require('../../../application/errors/AppError');

class EventTeamAssignment {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.role = props.role || 'Assistant';
    this.assignedBy = props.assignedBy;
    this.assignedAt = props.assignedAt || new Date();
    this.status = props.status || 'ACTIVE';

    this.validate();
  }

  static ROLES = Object.freeze([
    'Lead Photographer',
    'Second Photographer',
    'Videographer',
    'Editor',
    'Retoucher',
    'Album Designer',
    'Assistant',
    'Studio Manager'
  ]);

  validate() {
    if (!this.eventId) throw new AppError('Team assignment requires an eventId.', 400, 'INVALID_ASSIGNMENT');
    if (!this.userId) throw new AppError('Team assignment requires a userId.', 400, 'INVALID_ASSIGNMENT');
    if (!EventTeamAssignment.ROLES.includes(this.role)) {
      throw new AppError(`Invalid role: ${this.role}`, 400, 'INVALID_ROLE');
    }
  }
}

module.exports = EventTeamAssignment;
