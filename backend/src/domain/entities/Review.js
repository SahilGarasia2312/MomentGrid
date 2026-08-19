'use strict';

/**
 * Review — Pure Domain Entity
 *
 * Represents client feedback/rating for a studio.
 */
class Review {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.studioId
   * @param {string} props.clientName
   * @param {number} props.rating — 1 to 5
   * @param {string} props.comment
   * @param {boolean} props.isVerified
   * @param {boolean} props.isPublic
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.clientName = props.clientName;
    this.rating = Math.min(Math.max(Number(props.rating) || 5, 1), 5);
    this.comment = props.comment || '';
    this.isVerified = props.isVerified ?? true;
    this.isPublic = props.isPublic ?? true;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}

module.exports = Review;
