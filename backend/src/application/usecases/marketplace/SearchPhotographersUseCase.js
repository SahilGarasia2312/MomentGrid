'use strict';

/**
 * SearchPhotographersUseCase
 *
 * Public marketplace search for photographers.
 * Supports filtering by specialization, min experience, and min rating.
 * Supports sorting by rating, experience, and recency.
 * Implements offset pagination.
 */
class SearchPhotographersUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   */
  constructor(photographerRepository) {
    this.photographerRepository = photographerRepository;
  }

  /**
   * @param {object} params
   * @param {string}  [params.query]          - Free-text name/bio search
   * @param {string}  [params.specialization] - e.g. 'wedding', 'portrait'
   * @param {number}  [params.minExperience]  - Min years of experience
   * @param {number}  [params.minRating]      - Min average rating (0-5)
   * @param {string}  [params.sortBy]         - 'rating' | 'experience' | 'newest'
   * @param {number}  [params.page]
   * @param {number}  [params.limit]
   */
  async execute({
    query,
    specialization,
    minExperience,
    minRating,
    sortBy = 'newest',
    page = 1,
    limit = 12,
  } = {}) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));

    const filters = {};
    if (query)           filters.query = String(query).trim();
    if (specialization)  filters.specialization = String(specialization).trim().toLowerCase();
    if (minExperience !== undefined && minExperience !== null) {
      filters.minExperience = Math.max(0, parseInt(minExperience, 10) || 0);
    }
    if (minRating !== undefined && minRating !== null) {
      filters.minRating = Math.max(0, Math.min(5, parseFloat(minRating) || 0));
    }

    const { photographers, total } = await this.photographerRepository.search({
      filters,
      sortBy,
      page: safePage,
      limit: safeLimit,
    });

    return {
      data: photographers,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNextPage: safePage * safeLimit < total,
        hasPrevPage: safePage > 1,
      },
    };
  }
}

module.exports = SearchPhotographersUseCase;
