'use strict';

const { Router } = require('express');
const EventController = require('../controllers/EventController');
const authenticate = require('../middleware/authenticate');
const {
  createEventValidator,
  updateEventValidator,
  updateEventStatusValidator,
} = require('../validators/event.validators');
const productionRoutes = require('./production.routes');
const collaborationRoutes = require('./collaboration.routes');

const router = Router();

// All event routes require authentication
router.use(authenticate);

router.post('/', createEventValidator, EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/:id', EventController.getEventDetails);
router.patch('/:id', updateEventValidator, EventController.updateEvent);
router.patch('/:id/status', updateEventStatusValidator, EventController.updateStatus);

// Mount nested production & collaboration routes
router.use('/:eventId', productionRoutes);
router.use('/:eventId', collaborationRoutes);

module.exports = router;
