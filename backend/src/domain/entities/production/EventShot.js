'use strict';

const AppError = require('../../../application/errors/AppError');

class EventShot {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.shot = props.shot;
    this.category = props.category || 'GENERAL';
    this.priority = props.priority || 'MEDIUM';
    this.referenceImage = props.referenceImage || null;
    this.assignedPhotographerId = props.assignedPhotographerId || null;
    this.status = props.status || 'PENDING';
    this.notes = props.notes || '';

    this.validate();
  }

  static STATUSES = Object.freeze({
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
  });

  validate() {
    if (!this.eventId) throw new AppError('Shot requires an eventId.', 400, 'INVALID_SHOT');
    if (!this.shot || !this.shot.trim()) throw new AppError('Shot name is required.', 400, 'INVALID_SHOT');
  }
}

module.exports = EventShot;
