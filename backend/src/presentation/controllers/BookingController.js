'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repository
const MongoBookingRepository = require('../../infrastructure/database/repositories/MongoBookingRepository');

// Use Cases
const ListBookingPackagesUseCase = require('../../application/usecases/booking/ListBookingPackagesUseCase');
const GetCalendarAvailabilityUseCase = require('../../application/usecases/booking/GetCalendarAvailabilityUseCase');
const CreateEventBookingUseCase = require('../../application/usecases/booking/CreateEventBookingUseCase');
const GetBookingDetailsUseCase = require('../../application/usecases/booking/GetBookingDetailsUseCase');
const ProcessBookingPaymentUseCase = require('../../application/usecases/booking/ProcessBookingPaymentUseCase');
const CancelEventBookingUseCase = require('../../application/usecases/booking/CancelEventBookingUseCase');
const GetBookingNotificationsUseCase = require('../../application/usecases/booking/GetBookingNotificationsUseCase');

const bookingRepository = new MongoBookingRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * BookingController
 *
 * REST controller handling public and client photography booking workflows.
 */
class BookingController {
  /**
   * GET /v1/bookings/packages?studioId=xxx
   * Lists active photography packages available for booking.
   */
  async listPackages(req, res, next) {
    try {
      assertValid(req);
      const studioId = req.query.studioId;
      const useCase = new ListBookingPackagesUseCase(bookingRepository);
      const packages = await useCase.execute(studioId);

      return res.status(200).json({
        success: true,
        data: packages,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/bookings/availability?studioId=xxx&date=YYYY-MM-DD&packageId=xxx
   * Computes open and booked calendar time slots for the requested date.
   */
  async checkAvailability(req, res, next) {
    try {
      assertValid(req);
      const { studioId, date, packageId } = req.query;
      const useCase = new GetCalendarAvailabilityUseCase(bookingRepository);
      const slots = await useCase.execute({ studioId, date, packageId });

      return res.status(200).json({
        success: true,
        data: slots,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/bookings
   * Creates a new booking session and generates a retainer invoice.
   */
  async createBooking(req, res, next) {
    try {
      assertValid(req);
      const useCase = new CreateEventBookingUseCase(bookingRepository);
      const result = await useCase.execute(req.body);

      return res.status(201).json({
        success: true,
        message: 'Booking session requested and invoice generated successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/bookings/:id
   * Retrieves full details for a booking session along with linked invoice and studio metadata.
   */
  async getDetails(req, res, next) {
    try {
      const bookingId = req.params.id;
      const useCase = new GetBookingDetailsUseCase(bookingRepository);
      const details = await useCase.execute(bookingId);

      return res.status(200).json({
        success: true,
        data: details,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/bookings/:id/pay
   * Processes online payment checkout or retainer settlement and confirms session.
   */
  async payBooking(req, res, next) {
    try {
      assertValid(req);
      const bookingId = req.params.id;
      const { paymentId, method } = req.body;
      const useCase = new ProcessBookingPaymentUseCase(bookingRepository);
      const result = await useCase.execute({ bookingId, paymentId, method });

      return res.status(200).json({
        success: true,
        message: 'Payment processed and booking session officially confirmed.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/bookings/:id/cancel
   * Cancels a booking session and evaluates the 48-Hour Refund Eligibility Policy.
   */
  async cancelBooking(req, res, next) {
    try {
      assertValid(req);
      const bookingId = req.params.id;
      const { cancellationReason } = req.body;
      const useCase = new CancelEventBookingUseCase(bookingRepository);
      const result = await useCase.execute({ bookingId, cancellationReason });

      return res.status(200).json({
        success: true,
        message: 'Booking session cancelled successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/bookings/:id/notifications
   * Retrieves lifecycle alert audit trail for a booking session.
   */
  async listNotifications(req, res, next) {
    try {
      const bookingId = req.params.id;
      const useCase = new GetBookingNotificationsUseCase(bookingRepository);
      const logs = await useCase.execute(bookingId);

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookingController();
