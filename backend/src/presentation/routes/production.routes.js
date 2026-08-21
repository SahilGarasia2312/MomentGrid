'use strict';

const { Router } = require('express');
const ProductionController = require('../controllers/ProductionController');
const authenticate = require('../middleware/authenticate');
const {
  timelineValidator,
  taskValidator,
  shotValidator,
  deliverableValidator
} = require('../validators/production.validators');

// Note: This router is meant to be mounted on /v1/events/:eventId
const router = Router({ mergeParams: true });

router.use(authenticate);

// Timeline
router.route('/timeline')
  .get(ProductionController.getTimeline)
  .post(timelineValidator, ProductionController.addTimelineItem);
router.route('/timeline/:id')
  .patch(ProductionController.updateTimelineItem)
  .delete(ProductionController.removeTimelineItem);

// Tasks
router.route('/tasks')
  .get(ProductionController.getTasks)
  .post(taskValidator, ProductionController.addTask);
router.route('/tasks/:id')
  .patch(ProductionController.updateTask)
  .delete(ProductionController.removeTask);

// Shots
router.route('/shots')
  .get(ProductionController.getShots)
  .post(shotValidator, ProductionController.addShot);
router.route('/shots/:id')
  .patch(ProductionController.updateShot)
  .delete(ProductionController.removeShot);

// Deliverables
router.route('/deliverables')
  .get(ProductionController.getDeliverables)
  .post(deliverableValidator, ProductionController.addDeliverable);
router.route('/deliverables/:id')
  .patch(ProductionController.updateDeliverable)
  .delete(ProductionController.removeDeliverable);

module.exports = router;
