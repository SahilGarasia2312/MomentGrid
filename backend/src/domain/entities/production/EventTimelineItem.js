'use strict';

const AppError = require('../../../application/errors/AppError');

class EventTimelineItem {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.title = props.title;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.location = props.location || '';
    this.description = props.description || '';
    this.assignedStaffIds = Array.isArray(props.assignedStaffIds) ? props.assignedStaffIds : [];
    this.status = props.status || 'PENDING';

    this.validate();
  }

  validate() {
    if (!this.eventId) throw new AppError('Timeline item requires an eventId.', 400, 'INVALID_TIMELINE');
    if (!this.title || !this.title.trim()) throw new AppError('Timeline item title is required.', 400, 'INVALID_TIMELINE');
    if (!this.startTime) throw new AppError('Timeline start time is required.', 400, 'INVALID_TIMELINE');
    if (!this.endTime) throw new AppError('Timeline end time is required.', 400, 'INVALID_TIMELINE');
    if (this.startTime > this.endTime) {
      throw new AppError('Timeline start time cannot be after end time.', 400, 'INVALID_TIMELINE_TIME');
    }
  }
}

module.exports = EventTimelineItem;
