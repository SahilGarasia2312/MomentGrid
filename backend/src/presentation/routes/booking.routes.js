'use strict';

const { Router } = require('express');
const BookingController = require('../controllers/BookingController');
const {
  availabilityValidator,
  createBookingValidator,
  payBookingValidator,
  cancelBookingValidator,
} = require('../validators/booking.validators');

const router = Router();

// feature: public discovery endpoints for booking wizard
router.get('/packages', BookingController.listPackages);
router.get('/availability', availabilityValidator, BookingController.checkAvailability);

// feature: session booking creation & retainer invoice generation
router.post('/', createBookingValidator, BookingController.createBooking);

// feature: booking itinerary & invoice details
router.get('/:id', BookingController.getDetails);

// feature: online checkout & payment processing
router.post('/:id/pay', payBookingValidator, BookingController.payBooking);

// feature: 48-hour policy cancellation processing
router.post('/:id/cancel', cancelBookingValidator, BookingController.cancelBooking);

// feature: real-time alert logs
router.get('/:id/notifications', BookingController.listNotifications);

module.exports = router;
