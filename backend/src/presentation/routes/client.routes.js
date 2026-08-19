'use strict';

const { Router } = require('express');
const ClientController = require('../controllers/ClientController');
const authenticate = require('../middleware/authenticate');

const router = Router();

// All client dashboard routes require authentication
router.use(authenticate);

// ── Overview ───────────────────────────────────────────────────────────────
router.get('/:id/overview', ClientController.getOverview);
router.get('/me/overview', ClientController.getOverview);

// ── Bookings ───────────────────────────────────────────────────────────────
router.get('/:id/bookings', ClientController.listBookings);
router.get('/me/bookings', ClientController.listBookings);
router.post('/:id/bookings', ClientController.createBooking);
router.post('/me/bookings', ClientController.createBooking);

// ── Payments ───────────────────────────────────────────────────────────────
router.get('/:id/payments', ClientController.listPayments);
router.get('/me/payments', ClientController.listPayments);
router.post('/:id/payments/:paymentId/pay', ClientController.payInvoice);
router.post('/me/payments/:paymentId/pay', ClientController.payInvoice);

// ── Galleries & Downloads ──────────────────────────────────────────────────
router.get('/:id/galleries', ClientController.listGalleries);
router.get('/me/galleries', ClientController.listGalleries);
router.post('/:id/galleries/:galleryId/favorite', ClientController.toggleFavorite);
router.post('/me/galleries/:galleryId/favorite', ClientController.toggleFavorite);
router.post('/:id/galleries/:galleryId/download', ClientController.logDownload);
router.post('/me/galleries/:galleryId/download', ClientController.logDownload);

// ── Albums ─────────────────────────────────────────────────────────────────
router.get('/:id/albums', ClientController.listAlbums);
router.get('/me/albums', ClientController.listAlbums);
router.post('/:id/albums', ClientController.createAlbum);
router.post('/me/albums', ClientController.createAlbum);
router.patch('/:id/albums/:albumId', ClientController.updateAlbum);
router.patch('/me/albums/:albumId', ClientController.updateAlbum);

// ── Notifications ──────────────────────────────────────────────────────────
router.get('/:id/notifications', ClientController.getNotifications);
router.get('/me/notifications', ClientController.getNotifications);

// ── Profile ────────────────────────────────────────────────────────────────
router.get('/:id/profile', ClientController.getProfile);
router.get('/me/profile', ClientController.getProfile);
router.patch('/:id/profile', ClientController.updateProfile);
router.patch('/me/profile', ClientController.updateProfile);

module.exports = router;
