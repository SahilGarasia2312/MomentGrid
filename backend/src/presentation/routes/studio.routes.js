'use strict';

const { Router } = require('express');
const StudioController = require('../controllers/StudioController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  updateProfileValidator,
  addStaffValidator,
  packageValidator,
  eventValidator,
  galleryValidator,
  reviewValidator,
} = require('../validators/studio.validators');

const router = Router();

// Require authentication for all studio routes
router.use(authenticate);

// ── Studio Profile ────────────────────────────────────────────────────────
router.get('/profile', StudioController.getProfile);
router.patch('/profile', authorize('studio_owner', 'admin'), updateProfileValidator, StudioController.updateProfile);

// ── Staff Hub ─────────────────────────────────────────────────────────────
router.get('/staff', authorize('studio_owner', 'photographer', 'admin'), StudioController.listStaff);
router.post('/staff', authorize('studio_owner', 'admin'), addStaffValidator, StudioController.addStaff);
router.patch('/staff/:staffId', authorize('studio_owner', 'admin'), StudioController.updateStaffRole);
router.delete('/staff/:staffId', authorize('studio_owner', 'admin'), StudioController.removeStaff);

// ── Booking Packages ──────────────────────────────────────────────────────
router.get('/packages', StudioController.listPackages);
router.post('/packages', authorize('studio_owner', 'admin'), packageValidator, StudioController.createPackage);
router.patch('/packages/:packageId', authorize('studio_owner', 'admin'), StudioController.updatePackage);
router.delete('/packages/:packageId', authorize('studio_owner', 'admin'), StudioController.deletePackage);

// ── Events Schedule ───────────────────────────────────────────────────────
router.get('/events', authorize('studio_owner', 'photographer', 'admin'), StudioController.listEvents);
router.post('/events', authorize('studio_owner', 'photographer', 'client', 'admin'), eventValidator, StudioController.createEvent);
router.patch('/events/:eventId', authorize('studio_owner', 'photographer', 'admin'), StudioController.updateEventStatus);
router.delete('/events/:eventId', authorize('studio_owner', 'photographer', 'admin'), StudioController.deleteEvent);

// ── Client Galleries ──────────────────────────────────────────────────────
router.get('/galleries', StudioController.listGalleries);
router.post('/galleries', authorize('studio_owner', 'photographer', 'admin'), galleryValidator, StudioController.createGallery);
router.patch('/galleries/:galleryId/photos/:photoId/favorite', StudioController.toggleFavorite);
router.delete('/galleries/:galleryId', authorize('studio_owner', 'photographer', 'admin'), StudioController.deleteGallery);

// ── Client Reviews ────────────────────────────────────────────────────────
router.get('/reviews', StudioController.listReviews);
router.post('/reviews', reviewValidator, StudioController.createReview);
router.patch('/reviews/:reviewId/visibility', authorize('studio_owner', 'admin'), StudioController.toggleReviewVisibility);
router.delete('/reviews/:reviewId', authorize('studio_owner', 'admin'), StudioController.deleteReview);

// ── Studio Dashboard Analytics ────────────────────────────────────────────
router.get('/analytics', authorize('studio_owner', 'photographer', 'admin'), StudioController.getAnalytics);

module.exports = router;
