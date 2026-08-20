'use strict';

const AppError = require('../../application/errors/AppError');

/**
 * Event — Pure Domain Entity
 *
 * Represents a scheduled photography session/booking.
 */
class Event {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.studioId
   * @param {string} [props.clientId]
   * @param {string} [props.bookingId]
   * @param {string} props.title
   * @param {string} [props.eventType]
   * @param {string} [props.description]
   * @param {string} props.clientName
   * @param {string} props.clientEmail
   * @param {string|null} props.clientPhone
   * @param {string} props.eventDate — YYYY-MM-DD format
   * @param {string} props.startTime — HH:mm format
   * @param {string} props.endTime — HH:mm format
   * @param {string} [props.location]
   * @param {number} [props.expectedGuestCount]
   * @param {string|null} props.packageId
   * @param {Array<string>} props.assignedStaffIds
   * @param {string} props.status
   * @param {number} props.price
   * @param {string|null} props.notes
   * @param {string} [props.internalNotes]
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.clientId = props.clientId || null;
    this.bookingId = props.bookingId || null;
    this.title = props.title;
    this.eventType = props.eventType || 'wedding';
    this.description = props.description || '';
    this.clientName = props.clientName;
    this.clientEmail = (props.clientEmail || '').toLowerCase().trim();
    this.clientPhone = props.clientPhone || null;
    this.eventDate = props.eventDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.location = props.location || '';
    this.expectedGuestCount = Number(props.expectedGuestCount) || 0;
    this.packageId = props.packageId || null;
    this.assignedStaffIds = Array.isArray(props.assignedStaffIds) ? props.assignedStaffIds : [];
    this.status = props.status || Event.STATUSES.DRAFT;
    this.price = Number(props.price) || 0;
    this.notes = props.notes || '';
    this.internalNotes = props.internalNotes || '';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  validate() {
    if (!this.title || !this.title.trim()) {
      throw new AppError('Event title is required.', 400, 'INVALID_EVENT');
    }
    if (this.eventDate && this.startTime && this.endTime) {
      if (this.startTime > this.endTime) {
        throw new AppError('Start time cannot be after end time.', 400, 'INVALID_EVENT_TIME');
      }
    }
  }

  transitionTo(newStatus) {
    const validTransitions = {
      [Event.STATUSES.DRAFT]: [Event.STATUSES.PLANNED, Event.STATUSES.CANCELLED],
      [Event.STATUSES.PLANNED]: [Event.STATUSES.CONFIRMED, Event.STATUSES.CANCELLED],
      [Event.STATUSES.CONFIRMED]: [Event.STATUSES.READY_FOR_SHOOT, Event.STATUSES.CANCELLED],
      [Event.STATUSES.READY_FOR_SHOOT]: [Event.STATUSES.IN_PROGRESS, Event.STATUSES.CANCELLED],
      [Event.STATUSES.IN_PROGRESS]: [Event.STATUSES.SHOOT_COMPLETED],
      [Event.STATUSES.SHOOT_COMPLETED]: [Event.STATUSES.POST_PRODUCTION],
      [Event.STATUSES.POST_PRODUCTION]: [Event.STATUSES.CLIENT_REVIEW, Event.STATUSES.DELIVERED],
      [Event.STATUSES.CLIENT_REVIEW]: [Event.STATUSES.POST_PRODUCTION, Event.STATUSES.DELIVERED],
      [Event.STATUSES.DELIVERED]: [Event.STATUSES.COMPLETED],
      [Event.STATUSES.COMPLETED]: [],
      [Event.STATUSES.CANCELLED]: [],
      
      // Legacy backward-compat mapping
      'requested': ['confirmed', 'cancelled', Event.STATUSES.PLANNED, Event.STATUSES.CONFIRMED],
      'confirmed': ['completed', 'cancelled', Event.STATUSES.READY_FOR_SHOOT, Event.STATUSES.IN_PROGRESS],
      'completed': [],
      'cancelled': [],
    };

    const allowed = validTransitions[this.status];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${this.status} to ${newStatus}`,
        422,
        'INVALID_STATUS_TRANSITION'
      );
    }
    
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  static STATUSES = Object.freeze({
    // New Production Lifecycle
    DRAFT:           'DRAFT',
    PLANNED:         'PLANNED',
    CONFIRMED:       'CONFIRMED',
    READY_FOR_SHOOT: 'READY_FOR_SHOOT',
    IN_PROGRESS:     'IN_PROGRESS',
    SHOOT_COMPLETED: 'SHOOT_COMPLETED',
    POST_PRODUCTION: 'POST_PRODUCTION',
    CLIENT_REVIEW:   'CLIENT_REVIEW',
    DELIVERED:       'DELIVERED',
    COMPLETED:       'COMPLETED',
    CANCELLED:       'CANCELLED',

    // Legacy public booking lifecycle (deprecated but supported for old tests/records)
    REQUESTED:             'requested',
    LEGACY_CONFIRMED:      'confirmed',
    RESCHEDULE_REQUESTED:  'reschedule_requested',
    RESCHEDULED:           'rescheduled',
    LEGACY_COMPLETED:      'completed',
    LEGACY_CANCELLED:      'cancelled',
    REFUNDED:              'refunded',
  });
}

module.exports = Event;
