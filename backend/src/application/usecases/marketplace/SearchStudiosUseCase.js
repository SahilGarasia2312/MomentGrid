'use strict';

/**
 * SearchStudiosUseCase
 *
 * Public marketplace search for studios.
 * Supports filtering by name, location, specialization, and min-rating.
 * Supports sorting by rating, price, and recency.
 * Implements cursor-free offset pagination.
 *
 * Responsibilities:
 *   - Build and delegate a structured query to the repository
 *   - Return paginated results and metadata
 *
 * Zero infrastructure concerns here.
 */
class SearchStudiosUseCase {
  /**
   * @param {import('../../../domain/repositories/IStudioRepository')} studioRepository
   */
  constructor(studioRepository) {
    this.studioRepository = studioRepository;
  }

  /**
   * @param {object} params
   * @param {string}  [params.query]         - Free-text name/about search
   * @param {string}  [params.location]      - City or region filter
   * @param {string}  [params.specialization] - Category filter (wedding, portrait, etc.)
   * @param {number}  [params.minRating]     - Minimum average rating (0-5)
   * @param {string}  [params.sortBy]        - 'rating' | 'newest' (default: 'newest')
   * @param {number}  [params.page]          - 1-indexed page number (default: 1)
   * @param {number}  [params.limit]         - Results per page (default: 12, max: 48)
   */
  async execute({ query, location, specialization, minRating, sortBy = 'newest', page = 1, limit = 12 } = {}) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));

    const filters = {};
    if (query)          filters.query = String(query).trim();
    if (location)       filters.location = String(location).trim();
    if (specialization) filters.specialization = String(specialization).trim().toLowerCase();
    if (minRating !== undefined && minRating !== null) {
      filters.minRating = Math.max(0, Math.min(5, parseFloat(minRating) || 0));
    }

    const { studios, total } = await this.studioRepository.search({
      filters,
      sortBy,
      page: safePage,
      limit: safeLimit,
    });

    return {
      data: studios.map((s) => s.toPublic()),
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

module.exports = SearchStudiosUseCase;
