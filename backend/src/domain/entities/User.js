'use strict';

const crypto = require('crypto');

/**
 * User — Pure Domain Entity
 *
 * Contains only business rules and no framework / DB dependencies.
 * This is the single source of truth for what a "User" means in MomentGrid.
 */
class User {
  /**
   * @param {object} props
   * @param {string}  props.id
   * @param {string}  props.fullName
   * @param {string}  props.email
   * @param {string}  props.passwordHash
   * @param {string}  props.role  — 'studio_owner' | 'photographer' | 'client' | 'admin'
   * @param {boolean} props.emailVerified
   * @param {string|null} props.emailVerificationToken
   * @param {Date|null}   props.emailVerificationExpires
   * @param {string|null} props.resetPasswordToken
   * @param {Date|null}   props.resetPasswordExpires
   * @param {string}  props.status — 'active' | 'suspended' | 'pending_verification'
   * @param {string|null} props.phone
   * @param {string|null} props.studioId
   * @param {Date}    props.createdAt
   * @param {Date}    props.updatedAt
   * @param {Date|null}   props.lastLoginAt
   */
  constructor(props) {
    this.id = props.id;
    this.fullName = props.fullName;
    this.email = props.email.toLowerCase().trim();
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.emailVerified = props.emailVerified ?? false;
    this.emailVerificationToken = props.emailVerificationToken ?? null;
    this.emailVerificationExpires = props.emailVerificationExpires ?? null;
    this.resetPasswordToken = props.resetPasswordToken ?? null;
    this.resetPasswordExpires = props.resetPasswordExpires ?? null;
    this.status = props.status ?? 'pending_verification';
    this.phone = props.phone ?? null;
    this.studioId = props.studioId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.lastLoginAt = props.lastLoginAt ?? null;
  }

  // ── Business Rules ──────────────────────────────────────────────────────

  /** Returns true if this account is allowed to log in. */
  canLogin() {
    return this.status === 'active';
  }

  /** Returns true if the email address has been verified. */
  isEmailVerified() {
    return this.emailVerified === true;
  }

  /** Returns true if the account is suspended. */
  isSuspended() {
    return this.status === 'suspended';
  }

  /**
   * Generates and stores a signed email verification token.
   * Returns the RAW token (to be sent via email).
   * Only the SHA-256 hash is persisted in the DB.
   * @returns {string} raw token
   */
  generateEmailVerificationToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    return rawToken;
  }

  /**
   * Marks the email as verified and clears the token fields.
   */
  markEmailVerified() {
    this.emailVerified = true;
    this.status = 'active';
    this.emailVerificationToken = null;
    this.emailVerificationExpires = null;
    this.updatedAt = new Date();
  }

  /**
   * Generates and stores a password reset token.
   * Returns the RAW token (to be sent via email).
   * @returns {string} raw token
   */
  generatePasswordResetToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    return rawToken;
  }

  /** Returns true if the reset token window has not expired. */
  isResetTokenValid() {
    return (
      this.resetPasswordToken !== null &&
      this.resetPasswordExpires !== null &&
      this.resetPasswordExpires > new Date()
    );
  }

  /**
   * Clears the password reset token after successful reset.
   * @param {string} newPasswordHash
   */
  resetPassword(newPasswordHash) {
    this.passwordHash = newPasswordHash;
    this.resetPasswordToken = null;
    this.resetPasswordExpires = null;
    this.updatedAt = new Date();
  }

  /** Update last login timestamp */
  recordLogin() {
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  /** Returns a safe public representation (no password hash or tokens). */
  toPublic() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      emailVerified: this.emailVerified,
      status: this.status,
      phone: this.phone,
      studioId: this.studioId,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
    };
  }

  // ── Static Helpers ──────────────────────────────────────────────────────

  /** Hash a raw token for safe DB storage */
  static hashToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /** Valid roles in the system */
  static ROLES = Object.freeze({
    ADMIN: 'admin',
    STUDIO_OWNER: 'studio_owner',
    PHOTOGRAPHER: 'photographer',
    CLIENT: 'client',
  });

  /** Valid statuses */
  static STATUSES = Object.freeze({
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    PENDING: 'pending_verification',
  });
}

module.exports = User;
