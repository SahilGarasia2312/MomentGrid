'use client';

import { httpClient } from '../utils/httpClient';

export const clientApi = {
  async getOverview(clientId = 'me') {
    return httpClient(`/clients/${clientId}/overview`, { method: 'GET' });
  },

  async listBookings(clientId = 'me') {
    return httpClient(`/clients/${clientId}/bookings`, { method: 'GET' });
  },

  async createBooking(payload, clientId = 'me') {
    return httpClient(`/clients/${clientId}/bookings`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listPayments(clientId = 'me') {
    return httpClient(`/clients/${clientId}/payments`, { method: 'GET' });
  },

  async payInvoice(paymentId, method = 'credit_card', clientId = 'me') {
    return httpClient(`/clients/${clientId}/payments/${paymentId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    });
  },

  async listGalleries(clientId = 'me') {
    return httpClient(`/clients/${clientId}/galleries`, { method: 'GET' });
  },

  async toggleFavorite(galleryId, photoId, clientId = 'me') {
    return httpClient(`/clients/${clientId}/galleries/${galleryId}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ photoId }),
    });
  },

  async logDownload(galleryId, format = 'print', assetId = 'all', clientId = 'me') {
    return httpClient(`/clients/${clientId}/galleries/${galleryId}/download`, {
      method: 'POST',
      body: JSON.stringify({ format, assetId }),
    });
  },

  async listAlbums(clientId = 'me') {
    return httpClient(`/clients/${clientId}/albums`, { method: 'GET' });
  },

  async createAlbum(payload, clientId = 'me') {
    return httpClient(`/clients/${clientId}/albums`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAlbum(albumId, payload, clientId = 'me') {
    return httpClient(`/clients/${clientId}/albums/${albumId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async getNotifications(clientId = 'me') {
    return httpClient(`/clients/${clientId}/notifications`, { method: 'GET' });
  },

  async getProfile(clientId = 'me') {
    return httpClient(`/clients/${clientId}/profile`, { method: 'GET' });
  },

  async updateProfile(payload, clientId = 'me') {
    return httpClient(`/clients/${clientId}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
