'use strict';

/**
 * TokenBlacklist — In-memory blacklist for refresh tokens.
 *
 * Stores revoked refresh tokens (on logout, rotation, password reset).
 * In production, replace Map with Redis for multi-instance support.
 *
 * Design: store token string → expiry timestamp.
 * Runs periodic cleanup to prevent memory leaks.
 */
class TokenBlacklist {
  constructor() {
    /** @type {Map<string, number>} token → expiry (unix ms) */
    this._store = new Map();

    // Cleanup expired entries every 10 minutes
    this._cleanupInterval = setInterval(() => this._cleanup(), 10 * 60 * 1000);
    // Don't block process from exiting
    if (this._cleanupInterval.unref) this._cleanupInterval.unref();
  }

  /**
   * Add a token to the blacklist.
   * @param {string} token
   * @param {number} [ttlMs] — time-to-live in ms. Default: 30 days (covers max refresh TTL)
   */
  add(token, ttlMs = 30 * 24 * 60 * 60 * 1000) {
    this._store.set(token, Date.now() + ttlMs);
  }

  /**
   * Check if a token is blacklisted.
   * @param {string} token
   * @returns {boolean}
   */
  has(token) {
    const expiry = this._store.get(token);
    if (expiry === undefined) return false;
    if (Date.now() > expiry) {
      this._store.delete(token);
      return false;
    }
    return true;
  }

  /** Remove all expired entries. */
  _cleanup() {
    const now = Date.now();
    for (const [token, expiry] of this._store.entries()) {
      if (now > expiry) this._store.delete(token);
    }
  }

  /** Current size (for testing/monitoring). */
  get size() {
    return this._store.size;
  }
}

// Export a singleton — shared across all requests in one process
module.exports = new TokenBlacklist();
