'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

const MongoProductionRepository = require('../../infrastructure/database/repositories/MongoProductionRepository');
const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const ProductionUseCases = require('../../application/usecases/production/ProductionUseCases');

const productionRepository = new MongoProductionRepository();
const eventRepository = new MongoEventRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

class ProductionController {
  constructor() {
    this.useCases = new ProductionUseCases({ productionRepository, eventRepository });
  }

  // --- Timeline ---
  getTimeline = async (req, res, next) => {
    try {
      const data = await this.useCases.getTimeline(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  addTimelineItem = async (req, res, next) => {
    try {
      assertValid(req);
      const data = await this.useCases.addTimelineItem(req.params.eventId, req.body, req.userId, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };
  updateTimelineItem = async (req, res, next) => {
    try {
      const data = await this.useCases.updateTimelineItem(req.params.eventId, req.params.id, req.body, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  removeTimelineItem = async (req, res, next) => {
    try {
      await this.useCases.removeTimelineItem(req.params.eventId, req.params.id, req.userId, req.userRole);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  // --- Tasks ---
  getTasks = async (req, res, next) => {
    try {
      const data = await this.useCases.getTasks(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  addTask = async (req, res, next) => {
    try {
      assertValid(req);
      const data = await this.useCases.addTask(req.params.eventId, req.body, req.userId, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };
  updateTask = async (req, res, next) => {
    try {
      const data = await this.useCases.updateTask(req.params.eventId, req.params.id, req.body, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  removeTask = async (req, res, next) => {
    try {
      await this.useCases.removeTask(req.params.eventId, req.params.id, req.userId, req.userRole);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  // --- Shots ---
  getShots = async (req, res, next) => {
    try {
      const data = await this.useCases.getShots(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  addShot = async (req, res, next) => {
    try {
      assertValid(req);
      const data = await this.useCases.addShot(req.params.eventId, req.body, req.userId, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };
  updateShot = async (req, res, next) => {
    try {
      const data = await this.useCases.updateShot(req.params.eventId, req.params.id, req.body, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  removeShot = async (req, res, next) => {
    try {
      await this.useCases.removeShot(req.params.eventId, req.params.id, req.userId, req.userRole);
      res.json({ success: true });
    } catch (err) { next(err); }
  };

  // --- Deliverables ---
  getDeliverables = async (req, res, next) => {
    try {
      const data = await this.useCases.getDeliverables(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  addDeliverable = async (req, res, next) => {
    try {
      assertValid(req);
      const data = await this.useCases.addDeliverable(req.params.eventId, req.body, req.userId, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };
  updateDeliverable = async (req, res, next) => {
    try {
      const data = await this.useCases.updateDeliverable(req.params.eventId, req.params.id, req.body, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };
  removeDeliverable = async (req, res, next) => {
    try {
      await this.useCases.removeDeliverable(req.params.eventId, req.params.id, req.userId, req.userRole);
      res.json({ success: true });
    } catch (err) { next(err); }
  };
}

module.exports = new ProductionController();
