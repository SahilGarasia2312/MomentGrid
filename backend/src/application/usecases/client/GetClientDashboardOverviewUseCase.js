'use strict';

const AppError = require('../../errors/AppError');

class GetClientDashboardOverviewUseCase {
  constructor(clientRepository, userRepository) {
    this.clientRepository = clientRepository;
    this.userRepository = userRepository;
  }

  async execute({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to fetch portal overview.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    const emailStr = clientEmail.toLowerCase().trim();
    const [bookings, galleries, payments, albums, user] = await Promise.all([
      this.clientRepository.findBookingsByClientEmail(emailStr),
      this.clientRepository.findGalleriesByClientEmail(emailStr),
      this.clientRepository.findPaymentsByClientEmail(emailStr),
      this.clientRepository.findAlbumsByClientEmail(emailStr),
      this.userRepository.findByEmail(emailStr),
    ]);

    const activeBookings = bookings.filter((b) => ['confirmed', 'requested'].includes(b.status));
    const activeGalleries = galleries.filter((g) => g.status === 'published');
    const pendingPayments = payments.filter((p) => ['pending', 'overdue'].includes(p.status));
    const pendingAmountSum = pendingPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const albumsInProduction = albums.filter((a) => ['submitted', 'in_production'].includes(a.status));

    // Find next upcoming shoot
    const now = new Date().toISOString().slice(0, 10);
    const upcomingShoots = activeBookings
      .filter((b) => b.eventDate >= now)
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    const nextShoot = upcomingShoots[0] || null;

    // Build timeline events
    const timeline = [];
    bookings.slice(0, 3).forEach((b) => {
      timeline.push({
        id: `book-${b.id}`,
        type: 'booking',
        title: `Session: ${b.title}`,
        date: b.eventDate,
        status: b.status,
      });
    });
    galleries.slice(0, 3).forEach((g) => {
      timeline.push({
        id: `gal-${g.id}`,
        type: 'gallery',
        title: `Proof Gallery Ready: ${g.title}`,
        date: g.createdAt ? new Date(g.createdAt).toISOString().slice(0, 10) : 'Recent',
        status: `${g.photos.length} photos`,
      });
    });

    return {
      clientProfile: user
        ? {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            status: user.status,
          }
        : { email: emailStr, fullName: emailStr.split('@')[0] },
      kpis: {
        totalBookings: bookings.length,
        activeBookingsCount: activeBookings.length,
        activeGalleriesCount: activeGalleries.length,
        pendingInvoicesCount: pendingPayments.length,
        pendingBalance: pendingAmountSum,
        albumsInProductionCount: albumsInProduction.length,
      },
      nextShoot: nextShoot
        ? {
            id: nextShoot.id,
            title: nextShoot.title,
            date: nextShoot.eventDate,
            time: `${nextShoot.startTime} - ${nextShoot.endTime}`,
            status: nextShoot.status,
          }
        : null,
      recentTimeline: timeline.slice(0, 6),
    };
  }
}

module.exports = GetClientDashboardOverviewUseCase;
