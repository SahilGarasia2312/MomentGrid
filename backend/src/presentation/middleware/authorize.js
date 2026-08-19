'use strict';

const AppError = require('../../application/errors/AppError');

/**
 * authorize — Role-based access control middleware factory.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize('admin'), handler)
 *   router.get('/studio', authenticate, authorize('studio_owner', 'admin'), handler)
 *
 * Must be used AFTER the `authenticate` middleware (requires req.user).
 *
 * @param {...string} allowedRoles — one or more permitted roles
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          'Authentication required before authorization.',
          401,
          'AUTHENTICATION_REQUIRED'
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

module.exports = authorize;
