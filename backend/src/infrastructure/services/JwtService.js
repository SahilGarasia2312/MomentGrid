'use strict';

const jwt = require('jsonwebtoken');

/**
 * JwtService — Signs and verifies access and refresh tokens.
 *
 * Access tokens:  short-lived (15m), carry role + user data
 * Refresh tokens: long-lived (7d), carry only sub — used to mint new access tokens
 */
class JwtService {
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!this.accessSecret || !this.refreshSecret) {
      throw new Error('JWT secrets must be defined in environment variables.');
    }
  }

  /**
   * Sign an access token.
   * @param {{ sub: string, role: string, emailVerified: boolean, studioId?: string }} payload
   * @returns {string}
   */
  signAccessToken(payload) {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
      issuer: 'momentgrid.io',
      audience: 'momentgrid-app',
    });
  }

  /**
   * Sign a refresh token.
   * @param {{ sub: string }} payload
   * @param {string} [expiresIn] — override (e.g. '30d' for remember-me)
   * @returns {string}
   */
  signRefreshToken(payload, expiresIn) {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: expiresIn || this.refreshExpiresIn,
      issuer: 'momentgrid.io',
      audience: 'momentgrid-app',
    });
  }

  /**
   * Verify an access token. Throws if invalid or expired.
   * @param {string} token
   * @returns {{ sub: string, role: string, emailVerified: boolean }}
   */
  verifyAccessToken(token) {
    return jwt.verify(token, this.accessSecret, {
      issuer: 'momentgrid.io',
      audience: 'momentgrid-app',
    });
  }

  /**
   * Verify a refresh token. Throws if invalid or expired.
   * @param {string} token
   * @returns {{ sub: string }}
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecret, {
      issuer: 'momentgrid.io',
      audience: 'momentgrid-app',
    });
  }
}

module.exports = JwtService;
