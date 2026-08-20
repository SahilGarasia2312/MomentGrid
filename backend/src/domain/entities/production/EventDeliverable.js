'use strict';

const AppError = require('../../../application/errors/AppError');

class EventDeliverable {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.title = props.title; // e.g. "Edited photos"
    this.status = props.status || EventDeliverable.STATUSES.PENDING;
    this.deadline = props.deadline || null;
    this.responsiblePersonId = props.responsiblePersonId || null;
    this.deliveryDate = props.deliveryDate || null;

    this.validate();
  }

  static STATUSES = Object.freeze({
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    DELIVERED: 'DELIVERED',
  });

  validate() {
    if (!this.eventId) throw new AppError('Deliverable requires an eventId.', 400, 'INVALID_DELIVERABLE');
    if (!this.title || !this.title.trim()) throw new AppError('Deliverable title is required.', 400, 'INVALID_DELIVERABLE');
  }
}

module.exports = EventDeliverable;
