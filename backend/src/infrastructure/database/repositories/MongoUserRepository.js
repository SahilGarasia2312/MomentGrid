'use strict';

const UserModel = require('../models/UserModel');
const User = require('../../../domain/entities/User');
const IUserRepository = require('../../../domain/repositories/IUserRepository');

/**
 * MongoUserRepository — Concrete IUserRepository implementation.
 *
 * Responsible for mapping between Mongoose documents and domain User entities.
 * The application layer sees only the domain entity, never Mongoose docs.
 */
class MongoUserRepository extends IUserRepository {
  // ── Private: Mongoose → Domain ──────────────────────────────────────────

  /** @param {object} doc — Mongoose document (lean or full) */
  _toDomain(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      fullName: doc.fullName,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      status: doc.status,
      emailVerified: doc.emailVerified,
      emailVerificationToken: doc.emailVerificationToken ?? null,
      emailVerificationExpires: doc.emailVerificationExpires ?? null,
      resetPasswordToken: doc.resetPasswordToken ?? null,
      resetPasswordExpires: doc.resetPasswordExpires ?? null,
      phone: doc.phone,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastLoginAt: doc.lastLoginAt ?? null,
    });
  }

  // ── IUserRepository implementation ──────────────────────────────────────

  async findById(id) {
    const doc = await UserModel.findById(id)
      .select('+passwordHash +emailVerificationToken +emailVerificationExpires +resetPasswordToken +resetPasswordExpires')
      .lean();
    return this._toDomain(doc);
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .select('+passwordHash +emailVerificationToken +emailVerificationExpires +resetPasswordToken +resetPasswordExpires')
      .lean();
    return this._toDomain(doc);
  }

  async findByResetToken(hashedToken) {
    const doc = await UserModel.findOne({ resetPasswordToken: hashedToken })
      .select('+passwordHash +resetPasswordToken +resetPasswordExpires')
      .lean();
    return this._toDomain(doc);
  }

  async findByVerificationToken(hashedToken) {
    const doc = await UserModel.findOne({ emailVerificationToken: hashedToken })
      .select('+emailVerificationToken +emailVerificationExpires')
      .lean();
    return this._toDomain(doc);
  }

  async save(user) {
    const doc = await UserModel.create({
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationExpires: user.emailVerificationExpires,
      phone: user.phone,
      studioId: user.studioId,
    });

    // Re-fetch with all fields to return complete entity
    return this.findById(doc._id.toString());
  }

  async update(user) {
    await UserModel.findByIdAndUpdate(
      user.id,
      {
        $set: {
          fullName: user.fullName,
          email: user.email,
          passwordHash: user.passwordHash,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          emailVerificationToken: user.emailVerificationToken,
          emailVerificationExpires: user.emailVerificationExpires,
          resetPasswordToken: user.resetPasswordToken,
          resetPasswordExpires: user.resetPasswordExpires,
          phone: user.phone,
          studioId: user.studioId,
          lastLoginAt: user.lastLoginAt,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    return this.findById(user.id);
  }

  async delete(id) {
    await UserModel.findByIdAndDelete(id);
  }
}

module.exports = MongoUserRepository;
