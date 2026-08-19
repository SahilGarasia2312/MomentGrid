'use strict';

const { Router } = require('express');
const PhotographerController = require('../controllers/PhotographerController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  updateProfileValidator,
  blockDatesValidator,
  availabilityQueryValidator,
  uploadGalleryValidator,
} = require('../validators/photographer.validators');

const router = Router();

// Require authentication across all photographer dashboard routes
router.use(authenticate);

// ── Photographer Profile & Portfolio ──────────────────────────────────────
router.get('/:id/profile', PhotographerController.getProfile);
router.patch('/:id/profile', authorize('photographer', 'studio_owner', 'admin'), updateProfileValidator, PhotographerController.updateProfile);

// ── Availability & Schedule ───────────────────────────────────────────────
router.get('/:id/availability', availabilityQueryValidator, PhotographerController.getAvailability);
router.post('/:id/blocked-dates', authorize('photographer', 'studio_owner', 'admin'), blockDatesValidator, PhotographerController.manageBlockedDates);

// ── Assigned & Upcoming Events ────────────────────────────────────────────
router.get('/:id/events', PhotographerController.listEvents);

// ── Proof Gallery Upload ──────────────────────────────────────────────────
router.post('/:id/galleries', authorize('photographer', 'studio_owner', 'admin'), uploadGalleryValidator, PhotographerController.uploadGallery);

// ── Performance Dashboard Metrics ─────────────────────────────────────────
router.get('/:id/performance', PhotographerController.getPerformance);

// ── Notifications Hub ─────────────────────────────────────────────────────
router.get('/:id/notifications', PhotographerController.getNotifications);

// Shorthand `/me` routes resolving `req.user.id` to their photographer profile
router.get('/me', PhotographerController.getProfile);
router.patch('/me', authorize('photographer', 'studio_owner', 'admin'), updateProfileValidator, PhotographerController.updateProfile);

module.exports = router;
