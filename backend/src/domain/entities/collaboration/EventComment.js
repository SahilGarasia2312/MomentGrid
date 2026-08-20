'use strict';

const AppError = require('../../../application/errors/AppError');

class EventComment {
  constructor(props) {
    this.id = props.id || null;
    this.eventId = props.eventId;
    this.authorId = props.authorId;
    this.authorName = props.authorName;
    this.text = props.text;
    this.referenceType = props.referenceType || 'EVENT'; // e.g. 'TASK', 'TIMELINE'
    this.referenceId = props.referenceId || null;
    this.createdAt = props.createdAt || new Date();

    this.validate();
  }

  validate() {
    if (!this.eventId) throw new AppError('Comment requires an eventId.', 400, 'INVALID_COMMENT');
    if (!this.authorId) throw new AppError('Comment requires an authorId.', 400, 'INVALID_COMMENT');
    if (!this.text || !this.text.trim()) throw new AppError('Comment text is required.', 400, 'INVALID_COMMENT');
  }
}

module.exports = EventComment;
