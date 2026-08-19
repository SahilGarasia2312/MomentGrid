'use client';

import { httpClient } from '../utils/httpClient';

export const studioApi = {
  // Profile
  async getProfile(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/profile${query}`, { method: 'GET' });
  },
  async updateProfile(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/profile${query}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Staff
  async listStaff(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/staff${query}`, { method: 'GET' });
  },
  async addStaff(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/staff${query}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateStaffRole(staffId, payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/staff/${staffId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  async removeStaff(staffId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/staff/${staffId}${query}`, { method: 'DELETE' });
  },

  // Packages
  async listPackages(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/packages${query}`, { method: 'GET' });
  },
  async createPackage(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/packages${query}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updatePackage(packageId, payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/packages/${packageId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  async deletePackage(packageId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/packages/${packageId}${query}`, { method: 'DELETE' });
  },

  // Events
  async listEvents(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/events${query}`, { method: 'GET' });
  },
  async createEvent(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/events${query}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateEventStatus(eventId, payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/events/${eventId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  async deleteEvent(eventId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/events/${eventId}${query}`, { method: 'DELETE' });
  },

  // Galleries
  async listGalleries(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/galleries${query}`, { method: 'GET' });
  },
  async createGallery(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/galleries${query}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async togglePhotoFavorite(galleryId, photoId) {
    return httpClient(`/studio/galleries/${galleryId}/photos/${photoId}/favorite`, { method: 'PATCH' });
  },
  async deleteGallery(galleryId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/galleries/${galleryId}${query}`, { method: 'DELETE' });
  },

  // Reviews
  async listReviews(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/reviews${query}`, { method: 'GET' });
  },
  async createReview(payload, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/reviews${query}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async toggleReviewVisibility(reviewId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/reviews/${reviewId}/visibility${query}`, { method: 'PATCH' });
  },
  async deleteReview(reviewId, studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/reviews/${reviewId}${query}`, { method: 'DELETE' });
  },

  // Analytics
  async getAnalytics(studioId) {
    const query = studioId ? `?studioId=${studioId}` : '';
    return httpClient(`/studio/analytics${query}`, { method: 'GET' });
  },
};
