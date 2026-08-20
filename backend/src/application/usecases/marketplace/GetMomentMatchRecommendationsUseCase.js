'use strict';

const MomentMatchScoringEngine = require('../../../domain/services/MomentMatchScoringEngine');
const AppError = require('../../errors/AppError');

class GetMomentMatchRecommendationsUseCase {
  constructor({ studioRepository, packageRepository, eventRepository }) {
    this.studioRepository = studioRepository;
    this.packageRepository = packageRepository;
    this.eventRepository = eventRepository;
    this.scoringEngine = new MomentMatchScoringEngine();
  }

  async execute(requirements) {
    if (!requirements) throw new AppError('Requirements are required', 400, 'INVALID_REQUIREMENTS');

    // Fetch baseline candidates
    const { studios } = await this.studioRepository.search({ limit: 100 });

    const candidates = await Promise.all(studios.map(async (studio) => {
      // Find base price from packages
      const packages = await this.packageRepository.findByStudioId(studio.id);
      const basePrice = packages.length > 0 ? Math.min(...packages.map(p => p.price)) : null;

      // Check availability: fetch events for this studio
      const events = await this.eventRepository.findByStudioId(studio.id);
      // Determine if they are booked on the requested date
      const isAvailable = requirements.date 
        ? !events.some(e => e.eventDate && e.eventDate.toISOString().split('T')[0] === requirements.date)
        : true;

      return {
        id: studio.id,
        name: studio.name,
        isAvailable,
        basePrice,
        location: '', // studio location not fully defined in schema yet
        specialties: [], // mock
        styles: [], // mock
        rating: 0, // mock
      };
    }));

    return this.scoringEngine.scoreCandidates(requirements, candidates);
  }
}

module.exports = GetMomentMatchRecommendationsUseCase;
