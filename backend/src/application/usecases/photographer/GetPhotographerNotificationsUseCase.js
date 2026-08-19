'use strict';

const AppError = require('../../errors/AppError');

class GetPhotographerNotificationsUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   * @param {import('../../../domain/repositories/IEventRepository')} eventRepository
   */
  constructor(photographerRepository, eventRepository) {
    this.photographerRepository = photographerRepository;
    this.eventRepository = eventRepository;
  }

  async execute({ photographerId }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }

    const photographer = await this.photographerRepository.findById(photographerId);
    if (!photographer) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    // Dynamic notifications based on current events or mock simulated alerts
    let upcomingEvents = [];
    if (photographer.studioId && this.eventRepository) {
      try {
        const events = await this.eventRepository.findByStudioId(photographer.studioId);
        upcomingEvents = events.filter((e) => e.status === 'confirmed');
      } catch (e) {
        upcomingEvents = [];
      }
    }

    const notifications = [
      {
        id: 'notif-1',
        type: 'assignment',
        title: 'New Session Assigned',
        message: upcomingEvents.length > 0
          ? `You are assigned as Lead Shooter for "${upcomingEvents[0].title}" on ${upcomingEvents[0].eventDate}.`
          : 'You are assigned as Lead Shooter for "Sarah & Michael Wedding" on 2026-07-18.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        actionUrl: '/photographer/dashboard?tab=events',
      },
      {
        id: 'notif-2',
        type: 'gallery',
        title: 'Client Favorited Proofs',
        message: 'Client Sarah Mitchell favorited 14 photos in gallery "Golden Hour Bridal".',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        read: false,
        actionUrl: '/photographer/dashboard?tab=galleries',
      },
      {
        id: 'notif-3',
        type: 'review',
        title: 'New 5-Star Testimonial Received',
        message: '"Alex captured the quiet beauty of our day so effortlessly. 10/10 recommendation!"',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        actionUrl: '/photographer/dashboard?tab=performance',
      },
      {
        id: 'notif-4',
        type: 'system',
        title: 'Weekly Availability Sync Completed',
        message: 'Your blocked dates for July 2026 have been synchronized with the studio itinerary.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
        actionUrl: '/photographer/dashboard?tab=availability',
      },
    ];

    return {
      photographer_id: photographer.id,
      unread_count: notifications.filter((n) => !n.read).length,
      notifications,
    };
  }
}

module.exports = GetPhotographerNotificationsUseCase;
