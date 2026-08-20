'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

const MongoCollaborationRepository = require('../../infrastructure/database/repositories/MongoCollaborationRepository');
const MongoEventRepository = require('../../infrastructure/database/repositories/MongoEventRepository');
const MongoStaffRepository = require('../../infrastructure/database/repositories/MongoStaffRepository');
const CollaborationUseCases = require('../../application/usecases/collaboration/CollaborationUseCases');

const collaborationRepository = new MongoCollaborationRepository();
const eventRepository = new MongoEventRepository();
const staffRepository = new MongoStaffRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

class CollaborationController {
  constructor() {
    this.useCases = new CollaborationUseCases({ collaborationRepository, eventRepository, staffRepository });
  }

  // --- Team Assignment ---
  getTeam = async (req, res, next) => {
    try {
      const data = await this.useCases.getTeam(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  assignTeamMember = async (req, res, next) => {
    try {
      assertValid(req);
      const { userId, role } = req.body;
      const data = await this.useCases.assignTeamMember(req.params.eventId, userId, role, req.userId, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };

  // --- Activity History ---
  getActivityLog = async (req, res, next) => {
    try {
      const data = await this.useCases.getActivityLog(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  // --- Internal Comments ---
  getComments = async (req, res, next) => {
    try {
      const data = await this.useCases.getComments(req.params.eventId, req.userId, req.userRole);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  };

  addComment = async (req, res, next) => {
    try {
      assertValid(req);
      const { text } = req.body;
      // using req.userEmail or fallback for authorName
      const authorName = req.userRole === 'client' ? req.userEmail : 'Staff Member'; 
      const data = await this.useCases.addComment(req.params.eventId, text, req.userId, authorName, req.userRole);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  };
}

module.exports = new CollaborationController();
