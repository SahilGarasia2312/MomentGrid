'use strict';

const AppError = require('../../errors/AppError');

class GetPhotographerAvailabilityUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   * @param {import('../../../domain/repositories/IEventRepository')} eventRepository
   */
  constructor(photographerRepository, eventRepository) {
    this.photographerRepository = photographerRepository;
    this.eventRepository = eventRepository;
  }

  async execute({ photographerId, monthStr }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }
    if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
      throw new AppError('Month must be provided in YYYY-MM format.', 400, 'INVALID_MONTH_FORMAT');
    }

    const photographer = await this.photographerRepository.findById(photographerId);
    if (!photographer) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    const [year, month] = monthStr.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Find all events for the studio (if any) to check booked dates
    let studioEvents = [];
    if (photographer.studioId && this.eventRepository) {
      try {
        studioEvents = await this.eventRepository.findByStudioId(photographer.studioId);
      } catch (e) {
        studioEvents = [];
      }
    }

    const bookedDateSet = new Set();
    studioEvents.forEach((ev) => {
      // Check if event is confirmed/completed and assigned to this photographer or occurred during this month
      if (
        ev &&
        (ev.status === 'confirmed' || ev.status === 'completed') &&
        ev.eventDate &&
        ev.eventDate.startsWith(monthStr)
      ) {
        bookedDateSet.add(ev.eventDate);
      }
    });

    const available_dates = [];
    const booked_dates = Array.from(bookedDateSet);
    const blocked_dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (photographer.blockedDates.includes(dateStr)) {
        blocked_dates.push(dateStr);
        continue;
      }
      if (bookedDateSet.has(dateStr)) {
        continue;
      }

      const dateObj = new Date(`${dateStr}T12:00:00Z`);
      const dayName = dayNames[dateObj.getUTCDay()];
      if (photographer.availability[dayName] !== false) {
        available_dates.push(dateStr);
      }
    }

    return {
      photographer_id: photographer.id,
      month: monthStr,
      available_dates,
      booked_dates,
      blocked_dates,
    };
  }
}

module.exports = GetPhotographerAvailabilityUseCase;
