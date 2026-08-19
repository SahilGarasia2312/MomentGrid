'use strict';

const AppError = require('../../errors/AppError');
const notificationService = require('../../../infrastructure/notifications/NotificationService');

class TriggerSystemRemindersUseCase {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ recipientEmail, reminderType = 'gallery_ready' }) {
    if (!recipientEmail || !recipientEmail.trim()) {
      throw new AppError('Recipient email is required.', 400, 'RECIPIENT_EMAIL_REQUIRED');
    }

    const email = recipientEmail.trim();
    let type = 'gallery_ready';
    let title = 'Your Master Heirloom Gallery is Live! ✨';
    let body = 'Alex Kim has finished color grading your wedding collection. Explore all 284 high-resolution RAW captures and download your favorites.';
    let actionUrl = '/gallery-manager';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80';

    if (reminderType === 'booking_update') {
      type = 'booking_update';
      title = 'Session Confirmed: Villa d\'Este Como 📅';
      body = 'Your photography timeline is locked for October 14, 2026 at 3:30 PM. 2 Master Photographers & Drone Cinematographer assigned.';
      actionUrl = '/book/studio-momentgrid-collective';
      thumbnailUrl = 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&auto=format&fit=crop&q=80';
    } else if (reminderType === 'album_ready') {
      type = 'album_ready';
      title = 'Luxe Album Selection Open 📖';
      body = 'Please choose your favorite 45 spreads and select your Italian Nappa Leather cover material for the 12x12 Master Album.';
      actionUrl = '/albums/select';
      thumbnailUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    } else if (reminderType === 'payment_reminder') {
      type = 'payment_reminder';
      title = 'Cryptographic Escrow: Remaining Balance Due 💳';
      body = 'Your $960 advance deposit is verified. Please settle the remaining $1,820 balance via Razorpay before final digital rights release.';
      actionUrl = '/payments';
      thumbnailUrl = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80';
    }

    const result = await notificationService.dispatch({
      repository: this.notificationRepository,
      recipientEmail: email,
      recipientRole: 'client',
      type,
      title,
      body,
      actionUrl,
      thumbnailUrl,
      sendEmail: true,
      sendRealTime: true,
    });

    return result;
  }
}

module.exports = TriggerSystemRemindersUseCase;
