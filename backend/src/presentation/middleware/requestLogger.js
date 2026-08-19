'use strict';

/**
 * requestLogger — Lightweight dev request logger.
 * Only active when NODE_ENV=development.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const statusColor =
      res.statusCode >= 500 ? '\x1b[31m' : // red
      res.statusCode >= 400 ? '\x1b[33m' : // yellow
      res.statusCode >= 300 ? '\x1b[36m' : // cyan
      '\x1b[32m';                           // green
    console.log(
      `${statusColor}${res.statusCode}\x1b[0m ${req.method} ${req.originalUrl} — ${ms}ms`
    );
  });
  next();
};

module.exports = requestLogger;
