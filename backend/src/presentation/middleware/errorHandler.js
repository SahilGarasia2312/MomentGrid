'use strict';

const AppError = require('../../application/errors/AppError');

/**
 * errorHandler — Central Express error handling middleware.
 *
 * Catches all errors forwarded via next(err) from any route or middleware.
 * Distinguishes operational errors (AppError) from unexpected system errors.
 *
 * Never leaks stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // ── Log every error ──────────────────────────────────────────────────────
  if (isDev) {
    console.error(`\n❌ [${err.name || 'Error'}] ${err.message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // In production: log only non-operational (unexpected) errors
    if (!err.isOperational) {
      console.error('❌ Unexpected error:', err);
    }
  }

  // ── Mongoose / JWT error normalization ───────────────────────────────────
  if (err.name === 'ValidationError') {
    // Mongoose schema validation
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed.', details },
    });
  }

  if (err.code === 11000) {
    // Mongoose duplicate key
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: `A record with this ${field} already exists.`,
        details: [{ field, message: `${field} is already taken.` }],
      },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: 'Invalid resource identifier format.' },
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTHENTICATION_REQUIRED', message: 'Invalid token.' },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token has expired.' },
    });
  }

  // ── Operational errors (AppError) ────────────────────────────────────────
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // ── Unknown / unexpected errors ───────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? err.message : 'Something went wrong. Please try again later.',
      ...(isDev && err.stack ? { stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
