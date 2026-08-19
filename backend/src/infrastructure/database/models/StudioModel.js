'use strict';

const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Studio name is required.'],
      trim: true,
      maxlength: [100, 'Studio name cannot exceed 100 characters.'],
    },
    slug: {
      type: String,
      required: [true, 'Studio slug is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Studio must have an ownerId.'],
      index: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    brandColor: {
      type: String,
      default: '#C8A96E',
    },
    contactEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);
const StudioModel = mongoose.model('Studio', studioSchema);

module.exports = StudioModel;
