'use strict';

const AppError = require('../../errors/AppError');

class GetClientNotificationsUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to fetch notifications.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    const emailStr = clientEmail.toLowerCase().trim();
    const [bookings, galleries, payments, albums] = await Promise.all([
      this.clientRepository.findBookingsByClientEmail(emailStr),
      this.clientRepository.findGalleriesByClientEmail(emailStr),
      this.clientRepository.findPaymentsByClientEmail(emailStr),
      this.clientRepository.findAlbumsByClientEmail(emailStr),
    ]);

    const notifications = [];

    // Galleries notifications
    galleries.forEach((g) => {
      if (g.status === 'published') {
        notifications.push({
          id: `notif-gal-${g.id}`,
          type: 'gallery',
          title: `Proof Gallery Ready: ${g.title}`,
          message: `Your proof gallery containing ${g.photos.length} photos is published and ready for selection.`,
          timestamp: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Recent',
          read: false,
          actionUrl: 'gallery',
        });
      }
    });

    // Payments notifications
    payments.forEach((p) => {
      if (p.status === 'pending' || p.status === 'overdue') {
        notifications.push({
          id: `notif-pyt-${p.id}`,
          type: 'payment',
          title: `Invoice Due: ${p.invoiceNumber}`,
          message: `Payment of $${p.amount} (${p.currency}) for "${p.description}" is pending.`,
          timestamp: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'Upcoming',
          read: false,
          actionUrl: 'payments',
        });
      }
    });

    // Bookings notifications
    bookings.forEach((b) => {
      notifications.push({
        id: `notif-book-${b.id}`,
        type: 'booking',
        title: `Session ${b.status.toUpperCase()}: ${b.title}`,
        message: `Your session is scheduled for ${b.eventDate} between ${b.startTime} and ${b.endTime}.`,
        timestamp: b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : 'Recent',
        read: true,
        actionUrl: 'bookings',
      });
    });

    // Albums notifications
    albums.forEach((a) => {
      if (a.status === 'in_production') {
        notifications.push({
          id: `notif-alb-${a.id}`,
          type: 'album',
          title: `Print Album In Production: ${a.title}`,
          message: `Your custom ${a.coverMaterial} album with ${a.selectedPhotoIds.length} photos is currently in bindery.`,
          timestamp: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Recent',
          read: true,
          actionUrl: 'albums',
        });
      }
    });

    // Sort by unread first, then by title
    notifications.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));

    return {
      notifications,
      unread_count: notifications.filter((n) => !n.read).length,
    };
  }
}

module.exports = GetClientNotificationsUseCase;
