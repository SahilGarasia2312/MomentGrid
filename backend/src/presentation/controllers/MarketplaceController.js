'use strict';

const SearchStudiosUseCase = require('../../application/usecases/marketplace/SearchStudiosUseCase');
const SearchPhotographersUseCase = require('../../application/usecases/marketplace/SearchPhotographersUseCase');
const GetMomentMatchRecommendationsUseCase = require('../../application/usecases/marketplace/GetMomentMatchRecommendationsUseCase');
const MongoStudioRepository = require('../../infrastructure/database/repositories/MongoStudioRepository');
const MongoPhotographerRepository = require('../../infrastructure/database/repositories/MongoPhotographerRepository');
const { ListPackagesUseCase } = require('../../application/usecases/studio/PackageUseCases');
const MongoPackageRepository = require('../../infrastructure/database/repositories/MongoPackageRepository');
const { ListReviewsUseCase } = require('../../application/usecases/studio/ReviewUseCases');
const MongoReviewRepository = require('../../infrastructure/database/repositories/MongoReviewRepository');
const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const AppError = require('../../application/errors/AppError');

// Composed once — no per-request instantiation overhead
const studioRepo = new MongoStudioRepository();
const photographerRepo = new MongoPhotographerRepository();
const packageRepo = new MongoPackageRepository();
const reviewRepo = new MongoReviewRepository();
const eventRepo = new MongoEventRepository();

/**
 * MarketplaceController — Public, unauthenticated browsing and discovery.
 *
 * All handlers are deliberately public (no authenticate middleware).
 * Only safe, non-sensitive data is returned.
 */
class MarketplaceController {
  /**
   * GET /v1/marketplace/studios
   * Query: query, location, specialization, minRating, sortBy, page, limit
   */
  static async searchStudios(req, res, next) {
    try {
      const useCase = new SearchStudiosUseCase(studioRepo);
      const result = await useCase.execute(req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/marketplace/studios/:slug
   * Returns full public studio profile by slug (SEO-friendly URL)
   */
  static async getStudioBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const studio = await studioRepo.findBySlug(slug);
      if (!studio) {
        throw new AppError('Studio not found.', 404, 'STUDIO_NOT_FOUND');
      }

      const [packages, reviews] = await Promise.all([
        new ListPackagesUseCase(packageRepo).execute({ studioId: studio.id }),
        new ListReviewsUseCase(reviewRepo).execute({ studioId: studio.id, onlyPublic: true }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          studio: studio.toPublic(),
          packages,
          reviews,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/marketplace/photographers
   * Query: query, specialization, minExperience, minRating, sortBy, page, limit
   */
  static async searchPhotographers(req, res, next) {
    try {
      const useCase = new SearchPhotographersUseCase(photographerRepo);
      const result = await useCase.execute(req.query);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/marketplace/photographers/:id
   * Returns full public photographer profile
   */
  static async getPhotographerById(req, res, next) {
    try {
      const { id } = req.params;
      const photographer = await photographerRepo.findById(id);
      if (!photographer) {
        throw new AppError('Photographer not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
      }
      return res.status(200).json({ success: true, data: photographer });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/marketplace/momentmatch
   * Request body: { date, budget, location, eventType, style }
   */
  static async momentMatch(req, res, next) {
    try {
      const useCase = new GetMomentMatchRecommendationsUseCase({
        studioRepository: studioRepo,
        packageRepository: packageRepo,
        eventRepository: eventRepo
      });
      const data = await useCase.execute(req.body);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MarketplaceController;
