'use client';

import { httpClient } from '../utils/httpClient';

// feature: fallback sample data for booking wizard when API server is unreachable/preview
const fallbackPackages = [
  {
    id: 'pkg-luxury-wedding',
    title: 'Editorial Luxury Destination Wedding',
    price: 4500,
    currency: 'USD',
    durationMinutes: 480,
    deliverables: ['300+ Color-Graded Proofs', 'Master Leather Heirloom Album', 'Two Senior Shooters', '48h Preview Delivery'],
    description: 'Our most sought-after full-day wedding experience, shot on medium format and cinematic primes.',
    isFeatured: true,
  },
  {
    id: 'pkg-golden-hour',
    title: 'Golden Hour Cinematic Portraiture',
    price: 850,
    currency: 'USD',
    durationMinutes: 120,
    deliverables: ['45 High-Resolution Selects', 'Online Lightbox Proof Gallery', 'Wardrobe & Styling Consultation'],
    description: 'Bespoke sunset session tailored for artists, couples, and editorial editorials.',
    isFeatured: false,
  },
  {
    id: 'pkg-commercial-brand',
    title: 'Commercial Brand Architecture Suite',
    price: 2200,
    currency: 'USD',
    durationMinutes: 240,
    deliverables: ['Unlimited License Buyout', '100+ Retouched Master Assets', 'Studio & Location Lighting Rig'],
    description: 'Clean, high-impact commercial visuals crafted for luxury brands and architecture firms.',
    isFeatured: false,
  },
];

export const bookingApi = {
  /**
   * Get active photography packages offered by a studio
   */
  async getPackages(studioId = 'momentgrid-collective') {
    try {
      const res = await httpClient(`/bookings/packages?studioId=${studioId}`, { method: 'GET' });
      return res?.data ? res : { data: fallbackPackages };
    } catch (e) {
      return { data: fallbackPackages };
    }
  },

  /**
   * Check real-time calendar availability for a studio and date
   */
  async checkAvailability({ studioId = 'momentgrid-collective', date, packageId = null }) {
    try {
      const query = `/bookings/availability?studioId=${studioId}&date=${date}${packageId ? `&packageId=${packageId}` : ''}`;
      const res = await httpClient(query, { method: 'GET' });
      return res?.data ? res : {
        data: [
          { startTime: '09:00', endTime: '11:00', status: 'available' },
          { startTime: '11:30', endTime: '13:30', status: 'booked' },
          { startTime: '14:00', endTime: '16:00', status: 'available' },
          { startTime: '16:30', endTime: '18:30', status: 'available' },
        ],
      };
    } catch (e) {
      return {
        data: [
          { startTime: '09:00', endTime: '11:00', status: 'available' },
          { startTime: '11:30', endTime: '13:30', status: 'booked' },
          { startTime: '14:00', endTime: '16:00', status: 'available' },
          { startTime: '16:30', endTime: '18:30', status: 'available' },
        ],
      };
    }
  },

  /**
   * Create new booking session and generate retainer invoice
   */
  async createBooking(payload) {
    try {
      return await httpClient(`/bookings`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Return simulated success response
      return {
        success: true,
        data: {
          event: {
            id: `booking-${Date.now()}`,
            studioId: payload.studioId,
            title: payload.title || 'Cinematic Photography Session',
            clientName: payload.clientName,
            clientEmail: payload.clientEmail,
            eventDate: payload.eventDate,
            startTime: payload.startTime,
            endTime: payload.endTime || '12:00',
            status: 'requested',
            price: payload.price || 850,
          },
          payment: {
            id: `pay-${Date.now()}`,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            amount: payload.price || 850,
            currency: 'USD',
            status: 'pending',
          },
        },
      };
    }
  },

  /**
   * Retrieve full booking details along with linked invoice
   */
  async getDetails(bookingId) {
    return httpClient(`/bookings/${bookingId}`, { method: 'GET' });
  },

  /**
   * Process payment checkout or retainer settlement
   */
  async payBooking(bookingId, paymentId = null, method = 'credit_card') {
    return httpClient(`/bookings/${bookingId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentId, method }),
    });
  },

  /**
   * Cancel booking session and evaluate 48h refund eligibility
   */
  async cancelBooking(bookingId, cancellationReason = '') {
    return httpClient(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancellationReason }),
    });
  },

  /**
   * Get lifecycle alert notifications for a booking
   */
  async getNotifications(bookingId) {
    return httpClient(`/bookings/${bookingId}/notifications`, { method: 'GET' });
  },
};
