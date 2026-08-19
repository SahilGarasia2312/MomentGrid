'use strict';

/**
 * Studio — Pure Domain Entity
 *
 * Represents a photography studio profile, branding, and workspace configuration.
 */
class Studio {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.name
   * @param {string} props.slug
   * @param {string} props.ownerId
   * @param {string|null} props.logoUrl
   * @param {string|null} props.brandColor
   * @param {string|null} props.contactEmail
   * @param {string|null} props.phone
   * @param {string|null} props.about
   * @param {object|null} props.socialLinks — { instagram, facebook, website }
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.slug = (props.slug || props.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    this.ownerId = props.ownerId;
    this.logoUrl = props.logoUrl || null;
    this.brandColor = props.brandColor || '#C8A96E';
    this.contactEmail = props.contactEmail || null;
    this.phone = props.phone || null;
    this.about = props.about || '';
    this.socialLinks = props.socialLinks || { instagram: '', facebook: '', website: '' };
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Returns a safe public representation.
   */
  toPublic() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      ownerId: this.ownerId,
      logoUrl: this.logoUrl,
      brandColor: this.brandColor,
      contactEmail: this.contactEmail,
      phone: this.phone,
      about: this.about,
      socialLinks: this.socialLinks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Studio;
