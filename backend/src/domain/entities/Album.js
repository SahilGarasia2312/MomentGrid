'use strict';

const AppError = require('../../application/errors/AppError');

/**
 * Album — Pure Domain Entity
 *
 * Represents a client-curated physical print album or luxury wedding lookbook derived from a proof gallery.
 */
class Album {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.clientEmail
   * @param {string} props.clientName
   * @param {string} props.galleryId
   * @param {string} props.studioId
   * @param {string} props.title
   * @param {Array<string>} props.selectedPhotoIds — Legacy or default selected IDs
   * @param {Array<string>} props.favoritedPhotoIds — Explicitly favorited highlight shots
   * @param {Array<string>} props.rejectedPhotoIds — Explicitly rejected outtake shots
   * @param {Array<string>} props.orderedPhotoIds — Ordered sequence of photo IDs for spread layout
   * @param {Array<object>} props.photoComments — Array of { photoId, comment, clientName, createdAt }
   * @param {object} props.coverSpecs — { photoId, material, color, embossText }
   * @param {string} props.albumSize — e.g. '12x12 Master Luxe', '10x10 Square Heirloom', '11x14 Grand Editorial'
   * @param {number} props.pageCount — Total custom pages
   * @param {string} props.clientNotes — General instructions for layout or color grading
   * @param {string} props.status — 'selecting' | 'submitted' | 'in_production' | 'delivered'
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props = {}) {
    this.id = props.id || null;
    this.clientEmail = (props.clientEmail || '').toLowerCase().trim();
    this.clientName = props.clientName || 'Valued Client';
    this.galleryId = props.galleryId || null;
    this.studioId = props.studioId || null;
    this.title = props.title || 'Wedding & Heirloom Print Album';
    this.selectedPhotoIds = Array.isArray(props.selectedPhotoIds) ? props.selectedPhotoIds : [];
    this.favoritedPhotoIds = Array.isArray(props.favoritedPhotoIds) ? props.favoritedPhotoIds : [...this.selectedPhotoIds];
    this.rejectedPhotoIds = Array.isArray(props.rejectedPhotoIds) ? props.rejectedPhotoIds : [];
    this.orderedPhotoIds = Array.isArray(props.orderedPhotoIds) ? props.orderedPhotoIds : [...this.favoritedPhotoIds];
    this.photoComments = Array.isArray(props.photoComments) ? props.photoComments : [];
    
    this.coverSpecs = {
      photoId: props.coverSpecs?.photoId || null,
      material: props.coverSpecs?.material || props.coverMaterial || 'Italian Leather',
      color: props.coverSpecs?.color || 'Obsidian Black',
      embossText: props.coverSpecs?.embossText || props.title || 'Elena & Marcus — 2026',
    };

    this.albumSize = props.albumSize || '12x12 Master Luxe';
    this.pageCount = Number(props.pageCount) || 30;
    this.clientNotes = props.clientNotes || '';
    this.status = props.status || Album.STATUSES.SELECTING;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static STATUSES = Object.freeze({
    SELECTING: 'selecting',
    SUBMITTED: 'submitted',
    IN_PRODUCTION: 'in_production',
    DELIVERED: 'delivered',
  });

  canModify() {
    return this.status === Album.STATUSES.SELECTING;
  }

  toggleFavorite(photoId) {
    if (!this.canModify()) throw new AppError('Cannot modify album selection after submission.', 403, 'ALBUM_LOCKED');
    // If currently rejected, remove from rejected
    this.rejectedPhotoIds = this.rejectedPhotoIds.filter((id) => id !== photoId);

    const index = this.favoritedPhotoIds.indexOf(photoId);
    if (index > -1) {
      this.favoritedPhotoIds.splice(index, 1);
      this.orderedPhotoIds = this.orderedPhotoIds.filter((id) => id !== photoId);
    } else {
      this.favoritedPhotoIds.push(photoId);
      if (!this.orderedPhotoIds.includes(photoId)) {
        this.orderedPhotoIds.push(photoId);
      }
    }
    this.selectedPhotoIds = [...this.favoritedPhotoIds];
    this.updatedAt = new Date();
  }

  toggleReject(photoId) {
    if (!this.canModify()) throw new AppError('Cannot modify album selection after submission.', 403, 'ALBUM_LOCKED');
    // If favorited, remove from favorited and ordered
    this.favoritedPhotoIds = this.favoritedPhotoIds.filter((id) => id !== photoId);
    this.orderedPhotoIds = this.orderedPhotoIds.filter((id) => id !== photoId);
    this.selectedPhotoIds = [...this.favoritedPhotoIds];

    const index = this.rejectedPhotoIds.indexOf(photoId);
    if (index > -1) {
      this.rejectedPhotoIds.splice(index, 1);
    } else {
      this.rejectedPhotoIds.push(photoId);
    }
    this.updatedAt = new Date();
  }

  setSpreadOrder(newOrderArray) {
    if (!this.canModify()) throw new AppError('Cannot modify album selection after submission.', 403, 'ALBUM_LOCKED');
    if (!Array.isArray(newOrderArray)) throw new AppError('newOrderArray must be an array of photo IDs.', 400, 'INVALID_PAYLOAD');
    this.orderedPhotoIds = [...newOrderArray];
    this.updatedAt = new Date();
  }

  addOrUpdateComment(photoId, commentText, clientName = null) {
    if (!this.canModify()) throw new AppError('Cannot modify album comments after submission.', 403, 'ALBUM_LOCKED');
    const trimmed = (commentText || '').trim();
    const existingIndex = this.photoComments.findIndex((c) => c.photoId === photoId);

    if (!trimmed) {
      if (existingIndex > -1) {
        this.photoComments.splice(existingIndex, 1);
      }
    } else {
      const commentObj = {
        photoId,
        comment: trimmed,
        clientName: clientName || this.clientName,
        createdAt: new Date(),
      };
      if (existingIndex > -1) {
        this.photoComments[existingIndex] = commentObj;
      } else {
        this.photoComments.push(commentObj);
      }
    }
    this.updatedAt = new Date();
  }

  setCoverAndSize({ coverSpecs, albumSize, pageCount, clientNotes }) {
    if (!this.canModify()) throw new AppError('Cannot modify cover and sizing after submission.', 403, 'ALBUM_LOCKED');
    if (coverSpecs) {
      this.coverSpecs = { ...this.coverSpecs, ...coverSpecs };
    }
    if (albumSize) this.albumSize = albumSize;
    if (pageCount) this.pageCount = Number(pageCount);
    if (clientNotes !== undefined) this.clientNotes = clientNotes;
    this.updatedAt = new Date();
  }

  submitSelection() {
    if (this.status !== Album.STATUSES.SELECTING) {
      throw new AppError('Album has already been submitted or processed.', 400, 'ALBUM_ALREADY_SUBMITTED');
    }
    if (this.favoritedPhotoIds.length === 0 && this.orderedPhotoIds.length === 0) {
      throw new AppError('Please select at least 1 photo for your album spreads before submitting.', 400, 'NO_PHOTOS_SELECTED');
    }
    this.status = Album.STATUSES.SUBMITTED;
    this.updatedAt = new Date();
  }
}

module.exports = Album;
