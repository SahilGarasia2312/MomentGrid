'use strict';

/**
 * AppError — Operational Error class
 *
 * Use this for all known, expected errors (invalid input, not found, etc.).
 * The errorHandler middleware distinguishes these from unknown system errors.
 */
class AppError extends Error {
  /**
   * @param {string} message    — Human-readable message
   * @param {number} statusCode — HTTP status code
   * @param {string} code       — Machine-readable error code (matches API spec)
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // distinguishes from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
