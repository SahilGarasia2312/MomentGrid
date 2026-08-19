'use strict';

/**
 * AuthDTOs — Data Transfer Objects for the Authentication use cases.
 *
 * DTOs are plain objects. They enforce the shape of data crossing
 * the boundary between presentation and application layers.
 */

// ── Input DTOs ─────────────────────────────────────────────────────────────

class RegisterDTO {
  /**
   * @param {object} data
   * @param {string} data.fullName
   * @param {string} data.email
   * @param {string} data.password
   * @param {string} data.role
   * @param {string} [data.phone]
   */
  constructor({ fullName, email, password, role, phone }) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone || null;
  }
}

class LoginDTO {
  /**
   * @param {object} data
   * @param {string} data.email
   * @param {string} data.password
   * @param {boolean} [data.rememberMe]
   */
  constructor({ email, password, rememberMe }) {
    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe ?? false;
  }
}

class ForgotPasswordDTO {
  /** @param {{ email: string }} data */
  constructor({ email }) {
    this.email = email;
  }
}

class ResetPasswordDTO {
  /**
   * @param {object} data
   * @param {string} data.token  — raw token from email link
   * @param {string} data.password
   */
  constructor({ token, password }) {
    this.token = token;
    this.password = password;
  }
}

class VerifyEmailDTO {
  /** @param {{ token: string }} data — raw token from email link */
  constructor({ token }) {
    this.token = token;
  }
}

class RefreshTokenDTO {
  /** @param {{ refreshToken: string }} data */
  constructor({ refreshToken }) {
    this.refreshToken = refreshToken;
  }
}

class LogoutDTO {
  /** @param {{ refreshToken: string }} data */
  constructor({ refreshToken }) {
    this.refreshToken = refreshToken;
  }
}

// ── Output DTOs ────────────────────────────────────────────────────────────

class AuthResponseDTO {
  /**
   * @param {object} data
   * @param {object} data.user       — safe user object (no password)
   * @param {string} data.accessToken
   * @param {string} data.refreshToken
   */
  constructor({ user, accessToken, refreshToken }) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenType = 'Bearer';
    this.expiresIn = 900; // 15 minutes in seconds
  }
}

module.exports = {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
  RefreshTokenDTO,
  LogoutDTO,
  AuthResponseDTO,
};
