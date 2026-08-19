'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Standard JSON response for rate limit errors.
 */
const rateLimitHandler = (_req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please wait a moment and try again.',
    },
  });
};

/**
 * authLimiter — Strict limit for auth endpoints (login, register, forgot-password).
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * refreshLimiter — For token refresh endpoint.
 * 60 requests per minute per IP.
 */
const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * generalLimiter — Default limit for all other auth routes.
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { authLimiter, refreshLimiter, generalLimiter };
