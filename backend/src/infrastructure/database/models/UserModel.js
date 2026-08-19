'use strict';

const mongoose = require('mongoose');

/**
 * UserModel — Mongoose schema that mirrors the domain User entity.
 *
 * This is purely a persistence concern. The domain entity is the
 * single source of truth for business rules.
 */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters.'],
      maxlength: [100, 'Full name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required.'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'studio_owner', 'photographer', 'client'],
      required: [true, 'Role is required.'],
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'pending_verification',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
      index: true,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
      index: true,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    phone: {
      type: String,
      default: null,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
