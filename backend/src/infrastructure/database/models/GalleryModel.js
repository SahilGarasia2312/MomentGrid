'use strict';

const mongoose = require('mongoose');

// feature: comprehensive photo sub-schema with folder hierarchy & category indexes
const photoSubSchema = new mongoose.Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { type: String, default: 'general', index: true },
  folderId: { type: String, default: 'root', index: true },
  width: { type: Number, default: 3840 },
  height: { type: Number, default: 2160 },
  format: { type: String, default: 'jpg' },
  bytes: { type: Number, default: 2048000 },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// feature: hierarchical folder sub-schema
const folderSubSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  parentId: { type: String, default: null },
  photoCount: { type: Number, default: 0 },
});

// feature: watermark configuration schema
const watermarkConfigSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  text: { type: String, default: '© MomentGrid Collective' },
  opacity: { type: Number, default: 45 },
  position: { type: String, default: 'south_east' },
});

// feature: sharing rules & access control schema
const sharingConfigSchema = new mongoose.Schema({
  isPublic: { type: Boolean, default: true },
  requirePin: { type: Boolean, default: true },
  pinCode: { type: String, default: '2026' },
  allowDownloads: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
});

const gallerySchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Gallery must belong to a studioId.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Gallery title is required.'],
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required.'],
      lowercase: true,
      trim: true,
      index: true,
    },
    pinCode: {
      type: String,
      default: null,
    },
    coverUrl: {
      type: String,
      default: null,
    },
    photos: [photoSubSchema],
    folders: [folderSubSchema],
    categories: [{ type: String, trim: true }],
    watermarkConfig: { type: watermarkConfigSchema, default: () => ({}) },
    sharingConfig: { type: sharingConfigSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast client portal lookup
gallerySchema.index({ studioId: 1, clientEmail: 1 });

module.exports = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
