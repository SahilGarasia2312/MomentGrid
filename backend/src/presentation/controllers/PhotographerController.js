'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repositories
const MongoPhotographerRepository = require('../../infrastructure/database/repositories/MongoPhotographerRepository');
const MongoUserRepository = require('../../infrastructure/database/repositories/MongoUserRepository');
const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const MongoGalleryRepository = require('../../infrastructure/database/repositories/MongoGalleryRepository');
const MongoReviewRepository = require('../../infrastructure/database/repositories/MongoReviewRepository');
const MongoStaffRepository = require('../../infrastructure/database/repositories/MongoStaffRepository');

// Use Cases
const GetPhotographerProfileUseCase = require('../../application/usecases/photographer/GetPhotographerProfileUseCase');
const UpdatePhotographerProfileUseCase = require('../../application/usecases/photographer/UpdatePhotographerProfileUseCase');
const GetPhotographerAvailabilityUseCase = require('../../application/usecases/photographer/GetPhotographerAvailabilityUseCase');
const ManageBlockedDatesUseCase = require('../../application/usecases/photographer/ManageBlockedDatesUseCase');
const ListPhotographerEventsUseCase = require('../../application/usecases/photographer/ListPhotographerEventsUseCase');
const UploadPhotographerGalleryUseCase = require('../../application/usecases/photographer/UploadPhotographerGalleryUseCase');
const GetPhotographerPerformanceUseCase = require('../../application/usecases/photographer/GetPhotographerPerformanceUseCase');
const GetPhotographerNotificationsUseCase = require('../../application/usecases/photographer/GetPhotographerNotificationsUseCase');

// Composed repository instances
const photographerRepository = new MongoPhotographerRepository();
const userRepository = new MongoUserRepository();
const eventRepository = new MongoEventRepository();
const galleryRepository = new MongoGalleryRepository();
const reviewRepository = new MongoReviewRepository();
const staffRepository = new MongoStaffRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * Helper to resolve active photographer ID from auth or params
 */
const resolvePhotographerId = async (req) => {
  if (req.params.id && req.params.id !== 'me') {
    return req.params.id;
  }
  // Otherwise resolve from authenticated user
  const profile = await new GetPhotographerProfileUseCase(photographerRepository, userRepository).execute({
    userId: req.user.id,
  });
  return profile.id;
};

class PhotographerController {
  // ── Profile & Portfolio ──────────────────────────────────────────────────
  static async getProfile(req, res, next) {
    try {
      const photographerId = await resolvePhotographerId(req);
      const profile = await new GetPhotographerProfileUseCase(photographerRepository, userRepository).execute({
        photographerId,
      });
      return res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      assertValid(req);
      const photographerId = await resolvePhotographerId(req);
      const updated = await new UpdatePhotographerProfileUseCase(photographerRepository).execute({
        photographerId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // ── Availability Schedule ────────────────────────────────────────────────
  static async getAvailability(req, res, next) {
    try {
      assertValid(req);
      const photographerId = await resolvePhotographerId(req);
      const monthStr = req.query.month || new Date().toISOString().slice(0, 7);
      const availability = await new GetPhotographerAvailabilityUseCase(photographerRepository, eventRepository).execute({
        photographerId,
        monthStr,
      });
      return res.status(200).json({ success: true, data: availability });
    } catch (err) {
      next(err);
    }
  }

  static async manageBlockedDates(req, res, next) {
    try {
      assertValid(req);
      const photographerId = await resolvePhotographerId(req);
      const updated = await new ManageBlockedDatesUseCase(photographerRepository).execute({
        photographerId,
        dates: req.body.dates,
        action: req.body.action || 'block',
      });
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  // ── Assigned & Upcoming Events ───────────────────────────────────────────
  static async listEvents(req, res, next) {
    try {
      const photographerId = await resolvePhotographerId(req);
      const events = await new ListPhotographerEventsUseCase(
        photographerRepository,
        eventRepository,
        staffRepository
      ).execute({ photographerId });
      return res.status(200).json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  }

  // ── Gallery Upload ───────────────────────────────────────────────────────
  static async uploadGallery(req, res, next) {
    try {
      assertValid(req);
      const photographerId = await resolvePhotographerId(req);
      const gallery = await new UploadPhotographerGalleryUseCase(galleryRepository, photographerRepository).execute({
        photographerId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  }

  // ── Performance Dashboard ────────────────────────────────────────────────
  static async getPerformance(req, res, next) {
    try {
      const photographerId = await resolvePhotographerId(req);
      const performance = await new GetPhotographerPerformanceUseCase(
        photographerRepository,
        reviewRepository,
        eventRepository
      ).execute({ photographerId });
      return res.status(200).json({ success: true, data: performance });
    } catch (err) {
      next(err);
    }
  }

  // ── Notifications ────────────────────────────────────────────────────────
  static async getNotifications(req, res, next) {
    try {
      const photographerId = await resolvePhotographerId(req);
      const notifications = await new GetPhotographerNotificationsUseCase(
        photographerRepository,
        eventRepository
      ).execute({ photographerId });
      return res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PhotographerController;
