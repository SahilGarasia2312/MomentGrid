'use strict';

/**
 * Package — Pure Domain Entity
 *
 * Represents a photography package or booking tier offered by the studio.
 */
class Package {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.studioId
   * @param {string} props.title
   * @param {string} props.description
   * @param {number} props.price
   * @param {number} props.durationMinutes
   * @param {number} props.deliverablesCount
   * @param {boolean} props.isActive
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.title = props.title;
    this.description = props.description || '';
    this.price = Number(props.price) || 0;
    this.durationMinutes = Number(props.durationMinutes) || 120;
    this.deliverablesCount = Number(props.deliverablesCount) || 50;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}

module.exports = Package;
