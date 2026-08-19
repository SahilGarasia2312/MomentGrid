'use strict';

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
   * @param {string} props.title
   * @param {string} props.clientName
   * @param {string} props.clientEmail
   * @param {string|null} props.clientPhone
   * @param {string} props.eventDate — YYYY-MM-DD format
   * @param {string} props.startTime — HH:mm format
   * @param {string} props.endTime — HH:mm format
   * @param {string|null} props.packageId
   * @param {Array<string>} props.assignedStaffIds
   * @param {string} props.status — 'requested' | 'confirmed' | 'completed' | 'cancelled'
   * @param {number} props.price
   * @param {string|null} props.notes
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.title = props.title;
    this.clientName = props.clientName;
    this.clientEmail = props.clientEmail.toLowerCase().trim();
    this.clientPhone = props.clientPhone || null;
    this.eventDate = props.eventDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.packageId = props.packageId || null;
    this.assignedStaffIds = Array.isArray(props.assignedStaffIds) ? props.assignedStaffIds : [];
    this.status = props.status || 'confirmed';
    this.price = Number(props.price) || 0;
    this.notes = props.notes || '';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static STATUSES = Object.freeze({
    REQUESTED: 'requested',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  });
}

module.exports = Event;
