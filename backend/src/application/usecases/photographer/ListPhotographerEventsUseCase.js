'use strict';

const AppError = require('../../errors/AppError');

class ListPhotographerEventsUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   * @param {import('../../../domain/repositories/IEventRepository')} eventRepository
   * @param {import('../../../domain/repositories/IStaffRepository')} staffRepository
   */
  constructor(photographerRepository, eventRepository, staffRepository) {
    this.photographerRepository = photographerRepository;
    this.eventRepository = eventRepository;
    this.staffRepository = staffRepository;
  }

  async execute({ photographerId }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }

    const photographer = await this.photographerRepository.findById(photographerId);
    if (!photographer) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    let allEvents = [];
    if (photographer.studioId) {
      allEvents = await this.eventRepository.findByStudioId(photographer.studioId);
    } else {
      // Check if photographer is listed in staff by userId or email
      let staffList = [];
      if (this.staffRepository && photographer.userId) {
        try {
          const s = await this.staffRepository.findByUserId(photographer.userId);
          if (s) staffList.push(s);
        } catch (e) {
          staffList = [];
        }
      }
      if (staffList.length > 0) {
        allEvents = await this.eventRepository.findByStaffId(staffList[0].id);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const assigned_events = [];
    const upcoming_events = [];
    const past_events = [];

    allEvents.forEach((ev) => {
      if (!ev) return;
      assigned_events.push(ev);
      if (ev.eventDate >= todayStr && ev.status !== 'cancelled') {
        upcoming_events.push(ev);
      } else if (ev.status === 'completed' || ev.eventDate < todayStr) {
        past_events.push(ev);
      }
    });

    return {
      photographer_id: photographer.id,
      assigned_events,
      upcoming_events,
      past_events,
    };
  }
}

module.exports = ListPhotographerEventsUseCase;
