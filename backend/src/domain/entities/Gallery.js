'use strict';

/**
 * Gallery — Pure Domain Entity
 *
 * Represents a PIN-gated digital photo gallery with folder hierarchy,
 * category tagging, watermarking overlays, and public sharing configurations.
 */
class Gallery {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.studioId
   * @param {string} props.title
   * @param {string|null} props.eventId
   * @param {string|null} props.packageId
   * @param {string} props.clientEmail
   * @param {string|null} props.pinCode — Optional 4-6 digit PIN gate
   * @param {string|null} props.coverUrl
   * @param {Array<object>} props.photos — [{ id, url, caption, category, folderId, width, height, format, bytes, isFavorite, createdAt }]
   * @param {Array<object>} props.folders — [{ id, name, parentId, photoCount }]
   * @param {Array<string>} props.categories — e.g. ['wedding', 'editorial', 'portrait']
   * @param {object} props.watermarkConfig — { enabled, text, opacity, position }
   * @param {object} props.sharingConfig — { isPublic, requirePin, pinCode, allowDownloads, expiresAt }
   * @param {string} props.status — 'draft' | 'published'
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.studioId = props.studioId;
    this.title = props.title;
    this.eventId = props.eventId || null;
    this.packageId = props.packageId || null;
    this.clientEmail = (props.clientEmail || '').toLowerCase().trim();
    this.pinCode = props.pinCode || null;
    this.coverUrl = props.coverUrl || null;

    // feature: expanded photo metadata for gallery management
    this.photos = Array.isArray(props.photos)
      ? props.photos.map((p) => ({
          id: p.id || `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          url: p.url || '',
          caption: p.caption || '',
          category: (p.category || 'general').toLowerCase().trim(),
          folderId: p.folderId || 'root',
          width: Number(p.width) || 3840,
          height: Number(p.height) || 2160,
          format: p.format || 'jpg',
          bytes: Number(p.bytes) || 2048000,
          isFavorite: Boolean(p.isFavorite),
          createdAt: p.createdAt || new Date(),
        }))
      : [];

    // feature: hierarchical folder structure
    this.folders = Array.isArray(props.folders) && props.folders.length > 0
      ? props.folders
      : [
          { id: 'root', name: 'All Photos', parentId: null, photoCount: this.photos.length },
          { id: 'getting-ready', name: 'Getting Ready', parentId: 'root', photoCount: 0 },
          { id: 'ceremony', name: 'Ceremony & Vows', parentId: 'root', photoCount: 0 },
          { id: 'reception', name: 'Reception & Gala', parentId: 'root', photoCount: 0 },
        ];

    // feature: tagged categories across the gallery
    this.categories = Array.isArray(props.categories) && props.categories.length > 0
      ? props.categories
      : ['wedding', 'editorial', 'portrait', 'black-and-white'];

    // feature: dynamic Cloudinary watermark overlay settings
    this.watermarkConfig = props.watermarkConfig || {
      enabled: true,
      text: '© MomentGrid Collective',
      opacity: 45,
      position: 'south_east',
    };

    // feature: public sharing & access control configuration
    this.sharingConfig = props.sharingConfig || {
      isPublic: true,
      requirePin: Boolean(props.pinCode),
      pinCode: props.pinCode || '2026',
      allowDownloads: true,
      expiresAt: null,
    };

    this.status = props.status || 'published';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static STATUSES = Object.freeze({
    DRAFT: 'draft',
    PUBLISHED: 'published',
  });
}

module.exports = Gallery;
