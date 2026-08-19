'use client';

import { httpClient } from '../utils/httpClient';

export const photographerApi = {
  async getProfile(photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/profile`, { method: 'GET' });
  },

  async updateProfile(payload, photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async getAvailability(month, photographerId = 'me') {
    const query = month ? `?month=${month}` : '';
    return httpClient(`/photographers/${photographerId}/availability${query}`, { method: 'GET' });
  },

  async manageBlockedDates(dates, action = 'block', photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/blocked-dates`, {
      method: 'POST',
      body: JSON.stringify({ dates, action }),
    });
  },

  async listEvents(photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/events`, { method: 'GET' });
  },

  async uploadGallery(payload, photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/galleries`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPerformance(photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/performance`, { method: 'GET' });
  },

  async getNotifications(photographerId = 'me') {
    return httpClient(`/photographers/${photographerId}/notifications`, { method: 'GET' });
  },
};
