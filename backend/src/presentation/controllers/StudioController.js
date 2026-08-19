'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repositories
const MongoStudioRepository = require('../../infrastructure/database/repositories/MongoStudioRepository');
const MongoStaffRepository = require('../../infrastructure/database/repositories/MongoStaffRepository');
const MongoPackageRepository = require('../../infrastructure/database/repositories/MongoPackageRepository');
const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const MongoGalleryRepository = require('../../infrastructure/database/repositories/MongoGalleryRepository');
const MongoReviewRepository = require('../../infrastructure/database/repositories/MongoReviewRepository');
const MongoUserRepository = require('../../infrastructure/database/repositories/MongoUserRepository');

// Use Cases
const GetStudioProfileUseCase = require('../../application/usecases/studio/GetStudioProfileUseCase');
const UpdateStudioProfileUseCase = require('../../application/usecases/studio/UpdateStudioProfileUseCase');
const ListStaffUseCase = require('../../application/usecases/studio/ListStaffUseCase');
const AddStaffUseCase = require('../../application/usecases/studio/AddStaffUseCase');
const { UpdateStaffRoleUseCase, RemoveStaffUseCase } = require('../../application/usecases/studio/StaffActionsUseCases');
const { ListPackagesUseCase, CreatePackageUseCase, UpdatePackageUseCase, DeletePackageUseCase } = require('../../application/usecases/studio/PackageUseCases');
const { ListEventsUseCase, CreateEventUseCase, UpdateEventStatusUseCase, DeleteEventUseCase } = require('../../application/usecases/studio/EventUseCases');
const { ListGalleriesUseCase, CreateGalleryUseCase, TogglePhotoFavoriteUseCase, DeleteGalleryUseCase } = require('../../application/usecases/studio/GalleryUseCases');
const { ListReviewsUseCase, CreateReviewUseCase, ToggleReviewVisibilityUseCase, DeleteReviewUseCase } = require('../../application/usecases/studio/ReviewUseCases');
const GetStudioAnalyticsUseCase = require('../../application/usecases/studio/GetStudioAnalyticsUseCase');

// Composed shared repositories
const studioRepository = new MongoStudioRepository();
const staffRepository = new MongoStaffRepository();
const packageRepository = new MongoPackageRepository();
const eventRepository = new MongoEventRepository();
const galleryRepository = new MongoGalleryRepository();
const reviewRepository = new MongoReviewRepository();
const userRepository = new MongoUserRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * Helper to resolve active studio ID for the authenticated user.
 */
const resolveStudioId = async (req) => {
  let studioId = req.query.studioId || req.body.studioId;
  if (!studioId) {
    if (req.user.role === 'studio_owner') {
      const studio = await new GetStudioProfileUseCase(studioRepository, userRepository).execute({ ownerId: req.user.id });
      studioId = studio.id;
    } else if (req.user.role === 'photographer') {
      const user = await userRepository.findById(req.user.id);
      if (user && user.studioId) {
        studioId = user.studioId;
      } else {
        throw new AppError('No studio associated with your photographer account.', 403, 'NO_STUDIO_ASSIGNED');
      }
    } else {
      throw new AppError('Studio ID is required.', 400, 'MISSING_STUDIO_ID');
    }
  }
  return studioId;
};

class StudioController {
  // ── Studio Profile ────────────────────────────────────────────────────────
  static async getProfile(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const studio = await new GetStudioProfileUseCase(studioRepository, userRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: studio });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const updated = await new UpdateStudioProfileUseCase(studioRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // ── Staff Hub ─────────────────────────────────────────────────────────────
  static async listStaff(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const staffList = await new ListStaffUseCase(staffRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: staffList });
    } catch (err) {
      next(err);
    }
  }

  static async addStaff(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const staff = await new AddStaffUseCase(staffRepository, userRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  }

  static async updateStaffRole(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const updated = await new UpdateStaffRoleUseCase(staffRepository).execute({
        staffId: req.params.staffId,
        studioId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async removeStaff(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const result = await new RemoveStaffUseCase(staffRepository).execute({
        staffId: req.params.staffId,
        studioId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Booking Packages ──────────────────────────────────────────────────────
  static async listPackages(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const packages = await new ListPackagesUseCase(packageRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: packages });
    } catch (err) {
      next(err);
    }
  }

  static async createPackage(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const pkg = await new CreatePackageUseCase(packageRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: pkg });
    } catch (err) {
      next(err);
    }
  }

  static async updatePackage(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const updated = await new UpdatePackageUseCase(packageRepository).execute({
        packageId: req.params.packageId,
        studioId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deletePackage(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const result = await new DeletePackageUseCase(packageRepository).execute({
        packageId: req.params.packageId,
        studioId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Events Schedule ───────────────────────────────────────────────────────
  static async listEvents(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const events = await new ListEventsUseCase(eventRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  }

  static async createEvent(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const event = await new CreateEventUseCase(eventRepository, packageRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  static async updateEventStatus(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const updated = await new UpdateEventStatusUseCase(eventRepository).execute({
        eventId: req.params.eventId,
        studioId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const result = await new DeleteEventUseCase(eventRepository).execute({
        eventId: req.params.eventId,
        studioId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Client Galleries ──────────────────────────────────────────────────────
  static async listGalleries(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const galleries = await new ListGalleriesUseCase(galleryRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: galleries });
    } catch (err) {
      next(err);
    }
  }

  static async createGallery(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const gallery = await new CreateGalleryUseCase(galleryRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  }

  static async toggleFavorite(req, res, next) {
    try {
      const updated = await new TogglePhotoFavoriteUseCase(galleryRepository).execute({
        galleryId: req.params.galleryId,
        photoId: req.params.photoId,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteGallery(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const result = await new DeleteGalleryUseCase(galleryRepository).execute({
        galleryId: req.params.galleryId,
        studioId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Client Reviews ────────────────────────────────────────────────────────
  static async listReviews(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const reviews = await new ListReviewsUseCase(reviewRepository).execute({ studioId });
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  static async createReview(req, res, next) {
    try {
      assertValid(req);
      const studioId = await resolveStudioId(req);
      const review = await new CreateReviewUseCase(reviewRepository).execute({
        studioId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  static async toggleReviewVisibility(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const updated = await new ToggleReviewVisibilityUseCase(reviewRepository).execute({
        reviewId: req.params.reviewId,
        studioId,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const result = await new DeleteReviewUseCase(reviewRepository).execute({
        reviewId: req.params.reviewId,
        studioId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Studio Dashboard Analytics ────────────────────────────────────────────
  static async getAnalytics(req, res, next) {
    try {
      const studioId = await resolveStudioId(req);
      const analytics = await new GetStudioAnalyticsUseCase(
        eventRepository,
        galleryRepository,
        staffRepository,
        reviewRepository
      ).execute({ studioId });
      return res.status(200).json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StudioController;
