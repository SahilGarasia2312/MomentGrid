'use strict';

const AppError = require('../../application/errors/AppError');

// Repositories
const MongoClientRepository = require('../../infrastructure/database/repositories/MongoClientRepository');
const MongoUserRepository = require('../../infrastructure/database/repositories/MongoUserRepository');
const MongoStudioRepository = require('../../infrastructure/database/repositories/MongoStudioRepository');

// Use Cases
const GetClientDashboardOverviewUseCase = require('../../application/usecases/client/GetClientDashboardOverviewUseCase');
const ManageClientBookingsUseCase = require('../../application/usecases/client/ManageClientBookingsUseCase');
const ManageClientPaymentsUseCase = require('../../application/usecases/client/ManageClientPaymentsUseCase');
const ManageClientGalleriesUseCase = require('../../application/usecases/client/ManageClientGalleriesUseCase');
const ManageClientAlbumsUseCase = require('../../application/usecases/client/ManageClientAlbumsUseCase');
const GetClientNotificationsUseCase = require('../../application/usecases/client/GetClientNotificationsUseCase');
const ManageClientProfileUseCase = require('../../application/usecases/client/ManageClientProfileUseCase');

const clientRepository = new MongoClientRepository();
const userRepository = new MongoUserRepository();
const studioRepository = new MongoStudioRepository();

/**
 * Helper to resolve active client email from auth user or params
 */
const resolveClientEmail = async (req) => {
  if (req.params.id && req.params.id !== 'me' && req.params.id.includes('@')) {
    return req.params.id.toLowerCase().trim();
  }
  if (req.params.id && req.params.id !== 'me') {
    const user = await userRepository.findById(req.params.id);
    if (user && user.email) return user.email.toLowerCase().trim();
  }
  if (req.user && req.user.email) {
    return req.user.email.toLowerCase().trim();
  }
  throw new AppError('Unable to resolve authenticated client session.', 401, 'UNAUTHORIZED');
};

class ClientController {
  // ── Dashboard Overview ───────────────────────────────────────────────────
  static async getOverview(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const overview = await new GetClientDashboardOverviewUseCase(clientRepository, userRepository).execute({
        clientEmail,
      });
      return res.status(200).json({ success: true, data: overview });
    } catch (err) {
      next(err);
    }
  }

  // ── Bookings ─────────────────────────────────────────────────────────────
  static async listBookings(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const bookings = await new ManageClientBookingsUseCase(clientRepository, studioRepository).listBookings({
        clientEmail,
      });
      return res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  }

  static async createBooking(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const booking = await new ManageClientBookingsUseCase(clientRepository, studioRepository).requestBooking({
        clientEmail,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  }

  // ── Payments ─────────────────────────────────────────────────────────────
  static async listPayments(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const payments = await new ManageClientPaymentsUseCase(clientRepository).listPayments({ clientEmail });
      return res.status(200).json({ success: true, data: payments });
    } catch (err) {
      next(err);
    }
  }

  static async payInvoice(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const payment = await new ManageClientPaymentsUseCase(clientRepository).payInvoice({
        clientEmail,
        paymentId: req.params.paymentId,
        method: req.body.method,
      });
      return res.status(200).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  }

  // ── Galleries & Downloads ────────────────────────────────────────────────
  static async listGalleries(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const galleries = await new ManageClientGalleriesUseCase(clientRepository).listGalleries({ clientEmail });
      return res.status(200).json({ success: true, data: galleries });
    } catch (err) {
      next(err);
    }
  }

  static async toggleFavorite(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const gallery = await new ManageClientGalleriesUseCase(clientRepository).toggleFavorite({
        clientEmail,
        galleryId: req.params.galleryId,
        photoId: req.body.photoId,
      });
      return res.status(200).json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  }

  static async logDownload(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const result = await new ManageClientGalleriesUseCase(clientRepository).logDownload({
        clientEmail,
        galleryId: req.params.galleryId,
        format: req.body.format,
        assetId: req.body.assetId || 'all',
      });
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // ── Albums ───────────────────────────────────────────────────────────────
  static async listAlbums(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const albums = await new ManageClientAlbumsUseCase(clientRepository).listAlbums({ clientEmail });
      return res.status(200).json({ success: true, data: albums });
    } catch (err) {
      next(err);
    }
  }

  static async createAlbum(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const album = await new ManageClientAlbumsUseCase(clientRepository).createAlbum({
        clientEmail,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: album });
    } catch (err) {
      next(err);
    }
  }

  static async updateAlbum(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const album = await new ManageClientAlbumsUseCase(clientRepository).updateAlbum({
        clientEmail,
        albumId: req.params.albumId,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: album });
    } catch (err) {
      next(err);
    }
  }

  // ── Notifications ────────────────────────────────────────────────────────
  static async getNotifications(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const notifications = await new GetClientNotificationsUseCase(clientRepository).execute({ clientEmail });
      return res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  }

  // ── Profile ──────────────────────────────────────────────────────────────
  static async getProfile(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const profile = await new ManageClientProfileUseCase(userRepository).getProfile({ clientEmail });
      return res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const clientEmail = await resolveClientEmail(req);
      const profile = await new ManageClientProfileUseCase(userRepository).updateProfile({
        clientEmail,
        ...req.body,
      });
      return res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ClientController;
