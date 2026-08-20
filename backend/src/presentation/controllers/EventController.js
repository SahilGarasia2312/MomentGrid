'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const CreateEventUseCase = require('../../application/usecases/event/CreateEventUseCase');
const GetEventDetailsUseCase = require('../../application/usecases/event/GetEventDetailsUseCase');
const ListEventsUseCase = require('../../application/usecases/event/ListEventsUseCase');
const UpdateEventDetailsUseCase = require('../../application/usecases/event/UpdateEventDetailsUseCase');
const UpdateEventStatusUseCase = require('../../application/usecases/event/UpdateEventStatusUseCase');

const eventRepository = new MongoEventRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

class EventController {
  async createEvent(req, res, next) {
    try {
      assertValid(req);
      const useCase = new CreateEventUseCase({ eventRepository });
      const result = await useCase.execute(req.body, req.userRole, req.userId);

      return res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getEvents(req, res, next) {
    try {
      const useCase = new ListEventsUseCase({ eventRepository });
      const result = await useCase.execute(req.query, req.userId, req.userRole);

      return res.status(200).json({
        success: true,
        message: 'Events retrieved successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getEventDetails(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = new GetEventDetailsUseCase({ eventRepository });
      const result = await useCase.execute(id, req.userId, req.userRole);

      return res.status(200).json({
        success: true,
        message: 'Event details retrieved successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEvent(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const useCase = new UpdateEventDetailsUseCase({ eventRepository });
      const result = await useCase.execute(id, req.body, req.userId, req.userRole);

      return res.status(200).json({
        success: true,
        message: 'Event updated successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { status } = req.body;
      const useCase = new UpdateEventStatusUseCase({ eventRepository });
      const result = await useCase.execute(id, status, req.userId, req.userRole);

      return res.status(200).json({
        success: true,
        message: 'Event status updated successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EventController();
