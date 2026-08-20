'use strict';

const AppError = require('../../../application/errors/AppError');

class EventActivity {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.action = props.action; // e.g. "Photographer assigned"
    this.actorId = props.actorId || null;
    this.actorName = props.actorName || 'System';
    this.metadata = props.metadata || {}; // e.g. { taskId: '...' }
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  validate() {
    if (!this.eventId) throw new AppError('Activity requires an eventId.', 400, 'INVALID_ACTIVITY');
    if (!this.action || !this.action.trim()) throw new AppError('Activity requires an action description.', 400, 'INVALID_ACTIVITY');
  }
}

module.exports = EventActivity;
