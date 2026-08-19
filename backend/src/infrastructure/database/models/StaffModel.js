'use strict';

const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Staff must belong to a studioId.'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fullName: {
      type: String,
      required: [true, 'Staff member name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Staff member email is required.'],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['lead_photographer', 'second_shooter', 'editor', 'assistant'],
      default: 'lead_photographer',
    },
    status: {
      type: String,
      enum: ['active', 'invited'],
      default: 'active',
    },
    phone: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.index({ studioId: 1, email: 1 }, { unique: true });

const StaffModel = mongoose.model('Staff', staffSchema);

module.exports = StaffModel;
