'use strict';

const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');
const requireAdminRole = require('../middleware/requireAdminRole');
const {
  getUsersValidator,
  updateUserStatusValidator,
  getStudiosValidator,
  getPhotographersValidator,
  getClientsValidator,
  getActivityLogsValidator,
  updateSettingsValidator,
} = require('../validators/admin.validators');

// Apply admin guard to all routes in this router
router.use(requireAdminRole);

// GET /v1/admin/overview — Platform-wide KPI dashboard
router.get('/overview', AdminController.getPlatformOverview.bind(AdminController));

// GET /v1/admin/users — Paginated user list with filters
router.get('/users', getUsersValidator, AdminController.getAllUsers.bind(AdminController));

// PATCH /v1/admin/users/:id/status — Suspend / activate / change role
router.patch('/users/:id/status', updateUserStatusValidator, AdminController.updateUserStatus.bind(AdminController));

// GET /v1/admin/studios — Studio directory with revenue metrics
router.get('/studios', getStudiosValidator, AdminController.getAllStudios.bind(AdminController));

// GET /v1/admin/photographers — Photographer roster
router.get('/photographers', getPhotographersValidator, AdminController.getAllPhotographers.bind(AdminController));

// GET /v1/admin/clients — Client directory with booking/payment summary
router.get('/clients', getClientsValidator, AdminController.getAllClients.bind(AdminController));

// GET /v1/admin/revenue — Platform financial report
router.get('/revenue', AdminController.getRevenueReport.bind(AdminController));

// GET /v1/admin/analytics — Time-series analytics data
router.get('/analytics', AdminController.getAnalyticsData.bind(AdminController));

// GET /v1/admin/settings — Platform configuration
router.get('/settings', AdminController.getSettings.bind(AdminController));

// PATCH /v1/admin/settings — Update platform configuration
router.patch('/settings', updateSettingsValidator, AdminController.updateSettings.bind(AdminController));

// GET /v1/admin/activity-logs — Admin audit trail
router.get('/activity-logs', getActivityLogsValidator, AdminController.getActivityLogs.bind(AdminController));

module.exports = router;
