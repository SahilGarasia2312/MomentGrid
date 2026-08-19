'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');
const adminActivityLogger = require('../../infrastructure/admin/AdminActivityLogger');

// Use Cases
const GetPlatformOverviewUseCase = require('../../application/usecases/admin/GetPlatformOverviewUseCase');
const GetAllUsersUseCase = require('../../application/usecases/admin/GetAllUsersUseCase');
const UpdateUserStatusUseCase = require('../../application/usecases/admin/UpdateUserStatusUseCase');
const GetAllStudiosUseCase = require('../../application/usecases/admin/GetAllStudiosUseCase');
const GetAllPhotographersUseCase = require('../../application/usecases/admin/GetAllPhotographersUseCase');
const GetAllClientsUseCase = require('../../application/usecases/admin/GetAllClientsUseCase');
const GetRevenueReportUseCase = require('../../application/usecases/admin/GetRevenueReportUseCase');
const GetAnalyticsDataUseCase = require('../../application/usecases/admin/GetAnalyticsDataUseCase');
const GetActivityLogsUseCase = require('../../application/usecases/admin/GetActivityLogsUseCase');

// In-memory platform settings store (singleton)
let platformSettings = {
  maintenanceMode: false,
  userRegistrationEnabled: true,
  maxUploadsPerStudio: 5000,
  emailSenderName: 'MomentGrid Luxe',
  razorpayMode: 'test',
  supportEmail: 'support@momentgrid.io',
  updatedAt: new Date().toISOString(),
};

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * AdminController — Super Admin Command Centre REST Controller
 *
 * Handles all 11 admin panel endpoints: overview, users (list + update),
 * studios, photographers, clients, revenue, analytics, settings, activity logs.
 */
class AdminController {
  async getPlatformOverview(req, res, next) {
    try {
      const useCase = new GetPlatformOverviewUseCase();
      const data = await useCase.execute();

      adminActivityLogger.log({
        actor: req.adminEmail || 'superadmin@momentgrid.com',
        action: 'Accessed Platform Overview Dashboard',
        target: 'Dashboard:overview',
        type: 'report',
      });

      return res.status(200).json({
        success: true,
        message: 'Platform overview aggregated successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      assertValid(req);
      const { role, status, search, page, limit } = req.query;

      const useCase = new GetAllUsersUseCase();
      const data = await useCase.execute({
        role,
        status,
        search,
        page: Number(page || 1),
        limit: Number(limit || 20),
      });

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { status, role } = req.body;
      const actorEmail = req.adminEmail || 'superadmin@momentgrid.com';

      const useCase = new UpdateUserStatusUseCase();
      const updated = await useCase.execute({ userId: id, status, role, actorEmail });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllStudios(req, res, next) {
    try {
      assertValid(req);
      const { search, page, limit } = req.query;

      const useCase = new GetAllStudiosUseCase();
      const data = await useCase.execute({
        search,
        page: Number(page || 1),
        limit: Number(limit || 20),
      });

      return res.status(200).json({
        success: true,
        message: 'Studios retrieved successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllPhotographers(req, res, next) {
    try {
      assertValid(req);
      const { search, studioId, page, limit } = req.query;

      const useCase = new GetAllPhotographersUseCase();
      const data = await useCase.execute({
        search,
        studioId,
        page: Number(page || 1),
        limit: Number(limit || 20),
      });

      return res.status(200).json({
        success: true,
        message: 'Photographers retrieved successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllClients(req, res, next) {
    try {
      assertValid(req);
      const { search, status, page, limit } = req.query;

      const useCase = new GetAllClientsUseCase();
      const data = await useCase.execute({
        search,
        status,
        page: Number(page || 1),
        limit: Number(limit || 20),
      });

      return res.status(200).json({
        success: true,
        message: 'Clients retrieved successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getRevenueReport(req, res, next) {
    try {
      const useCase = new GetRevenueReportUseCase();
      const data = await useCase.execute();

      adminActivityLogger.log({
        actor: req.adminEmail || 'superadmin@momentgrid.com',
        action: 'Accessed Revenue Report — Platform financial KPIs retrieved',
        target: 'Report:revenue',
        type: 'report',
      });

      return res.status(200).json({
        success: true,
        message: 'Revenue report generated successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAnalyticsData(req, res, next) {
    try {
      const useCase = new GetAnalyticsDataUseCase();
      const data = await useCase.execute();

      return res.status(200).json({
        success: true,
        message: 'Analytics data generated successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSettings(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Platform settings retrieved.',
        data: platformSettings,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      assertValid(req);
      const actorEmail = req.adminEmail || 'superadmin@momentgrid.com';

      // feature: apply only provided fields (partial update pattern)
      const allowed = ['maintenanceMode', 'userRegistrationEnabled', 'maxUploadsPerStudio', 'emailSenderName', 'razorpayMode', 'supportEmail'];
      const updates = {};
      allowed.forEach((key) => {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      });

      Object.assign(platformSettings, updates, { updatedAt: new Date().toISOString() });

      adminActivityLogger.log({
        actor: actorEmail,
        action: `Platform settings updated — fields: ${Object.keys(updates).join(', ')}`,
        target: 'Settings:platform',
        type: 'settings',
      });

      return res.status(200).json({
        success: true,
        message: 'Platform settings updated successfully.',
        data: platformSettings,
      });
    } catch (err) {
      next(err);
    }
  }

  async getActivityLogs(req, res, next) {
    try {
      assertValid(req);
      const { type, search, page, limit } = req.query;

      const useCase = new GetActivityLogsUseCase();
      const data = await useCase.execute({
        type,
        search,
        page: Number(page || 1),
        limit: Number(limit || 30),
      });

      return res.status(200).json({
        success: true,
        message: 'Activity logs retrieved successfully.',
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
