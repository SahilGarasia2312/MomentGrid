'use strict';

/**
 * Photographer — Pure Domain Entity
 *
 * Encapsulates the professional profile, portfolio, specializations,
 * availability schedule, and performance stats of an individual photographer.
 */
class Photographer {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.userId
   * @param {string} props.studioId
   * @param {string} props.fullName
   * @param {string} props.email
   * @param {string} props.bio
   * @param {string} props.avatarUrl
   * @param {string} props.portfolioUrl
   * @param {string[]} props.specializations
   * @param {number} props.yearsExperience
   * @param {object} props.availability - e.g. { monday: true, tuesday: true... }
   * @param {string[]} props.blockedDates - e.g. ['2026-07-20', '2026-07-21']
   * @param {object} props.stats - e.g. { totalSessions, totalPhotosDelivered, averageRating, totalReviews }
   * @param {Array}  props.portfolioItems - e.g. [{ id, title, category, imageUrl, clientName }]
   * @param {Date}   props.createdAt
   * @param {Date}   props.updatedAt
   */
  constructor(props = {}) {
    this.id = props.id || null;
    this.userId = props.userId || null;
    this.studioId = props.studioId || null;
    this.fullName = props.fullName || '';
    this.email = props.email ? props.email.toLowerCase().trim() : '';
    this.bio = props.bio || 'Professional cinematic portrait and event photographer.';
    this.avatarUrl = props.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    this.portfolioUrl = props.portfolioUrl || 'https://momentgrid.io/photographers/portfolio';
    this.specializations = Array.isArray(props.specializations) ? props.specializations : ['wedding', 'portrait', 'editorial'];
    this.yearsExperience = typeof props.yearsExperience === 'number' ? props.yearsExperience : 5;
    this.availability = props.availability || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    };
    this.blockedDates = Array.isArray(props.blockedDates) ? props.blockedDates : [];
    this.stats = props.stats || {
      totalSessions: 42,
      totalPhotosDelivered: 4890,
      averageRating: 4.9,
      totalReviews: 38,
    };
    this.portfolioItems = Array.isArray(props.portfolioItems) ? props.portfolioItems : [
      { id: 'port-1', title: 'Golden Hour Bridal Portraiture', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', clientName: 'Sarah & Michael' },
      { id: 'port-2', title: 'Vogue Summer Editorial Series', category: 'editorial', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', clientName: 'Vogue Collective' },
      { id: 'port-3', title: 'Cinematic Sunset Rings', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', clientName: 'Aria & David' },
      { id: 'port-4', title: 'Monochrome Studio Headshot', category: 'portrait', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', clientName: 'Devon Vance' },
    ];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Checks if photographer is available on a specific ISO date (YYYY-MM-DD)
   */
  isAvailableOnDate(dateStr) {
    if (this.blockedDates.includes(dateStr)) {
      return false;
    }
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return true;
    const dayName = dayNames[dateObj.getUTCDay()];
    return this.availability[dayName] !== false;
  }

  /**
   * Toggles a date inside blockedDates array
   */
  toggleBlockedDate(dateStr) {
    const idx = this.blockedDates.indexOf(dateStr);
    if (idx > -1) {
      this.blockedDates.splice(idx, 1);
    } else {
      this.blockedDates.push(dateStr);
    }
    this.updatedAt = new Date();
  }
}

module.exports = Photographer;
