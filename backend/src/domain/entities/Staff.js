'use strict';

/**
 * Staff — Pure Domain Entity
 *
 * Represents a team member assigned to a photography studio (lead photographer, second shooter, editor, assistant).
 */
class Staff {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.studioId
   * @param {string|null} props.userId — Linked system User ID if registered
   * @param {string} props.fullName
   * @param {string} props.email
   * @param {string} props.role — 'lead_photographer' | 'second_shooter' | 'editor' | 'assistant'
   * @param {string} props.status — 'active' | 'invited'
   * @param {string|null} props.phone
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.userId = props.userId || null;
    this.fullName = props.fullName;
    this.email = props.email.toLowerCase().trim();
    this.role = props.role || 'lead_photographer';
    this.status = props.status || 'active';
    this.phone = props.phone || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static ROLES = Object.freeze({
    LEAD_PHOTOGRAPHER: 'lead_photographer',
    SECOND_SHOOTER: 'second_shooter',
    EDITOR: 'editor',
    ASSISTANT: 'assistant',
  });

  static STATUSES = Object.freeze({
    ACTIVE: 'active',
    INVITED: 'invited',
  });
}

module.exports = Staff;
