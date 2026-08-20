'use strict';

const AppError = require('../../../application/errors/AppError');

class EventTask {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.task = props.task;
    this.description = props.description || '';
    this.priority = props.priority || 'MEDIUM';
    this.assigneeId = props.assigneeId || null;
    this.dueDate = props.dueDate || null;
    this.status = props.status || EventTask.STATUSES.TODO;

    this.validate();
  }

  static STATUSES = Object.freeze({
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    BLOCKED: 'BLOCKED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  });

  static PRIORITIES = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
  });

  validate() {
    if (!this.eventId) throw new AppError('Task requires an eventId.', 400, 'INVALID_TASK');
    if (!this.task || !this.task.trim()) throw new AppError('Task name is required.', 400, 'INVALID_TASK');
    if (!Object.values(EventTask.STATUSES).includes(this.status)) {
      throw new AppError(`Invalid task status: ${this.status}`, 400, 'INVALID_TASK_STATUS');
    }
  }
}

module.exports = EventTask;
