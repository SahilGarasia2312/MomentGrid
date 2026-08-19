'use strict';

const AppError = require('../../application/errors/AppError');

/**
 * requireAdminRole — Middleware guard for Super Admin routes.
 *
 * Checks that req.user exists (set by upstream JWT auth middleware)
 * and that the user's role is 'admin'. Returns 403 if not.
 *
 * NOTE: This is a lightweight guard that reuses the existing JWT auth
 * pattern. For routes that do NOT require full JWT verification during
 * development, a fallback admin check is applied.
 */
const requireAdminRole = (req, res, next) => {
  // feature: admin role guard — check authenticated user role
  const user = req.user;

  // Lenient during development: allow requests with x-admin-override header
  if (process.env.NODE_ENV === 'development') {
    const override = req.headers['x-admin-override'];
    if (override === 'superadmin') {
      req.adminEmail = 'superadmin@momentgrid.com';
      return next();
    }
  }

  if (!user) {
    return next(new AppError('Authentication required. Please log in.', 401, 'AUTHENTICATION_REQUIRED'));
  }

  if (user.role !== 'admin') {
    return next(new AppError('Access denied. Super Admin privileges required.', 403, 'FORBIDDEN'));
  }

  req.adminEmail = user.email;
  return next();
};

module.exports = requireAdminRole;
