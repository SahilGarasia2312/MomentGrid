'use strict';

const mongoose = require('mongoose');

const photoCommentSchema = new mongoose.Schema(
  {
    photoId: { type: String, required: true },
    comment: { type: String, required: true, trim: true },
    clientName: { type: String, default: 'Client' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const coverSpecsSchema = new mongoose.Schema(
  {
    photoId: { type: String, default: null },
    material: { type: String, default: 'Italian Leather' },
    color: { type: String, default: 'Obsidian Black' },
    embossText: { type: String, default: '' },
  },
  { _id: false }
);

const albumSchema = new mongoose.Schema(
  {
    clientEmail: {
      type: String,
      required: [true, 'Client email is required.'],
      lowercase: true,
      trim: true,
      index: true,
    },
    clientName: {
      type: String,
      default: 'Valued Client',
      trim: true,
    },
    galleryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gallery',
      default: null,
      index: true,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Album title is required.'],
      trim: true,
    },
    selectedPhotoIds: {
      type: [String],
      default: [],
    },
    favoritedPhotoIds: {
      type: [String],
      default: [],
    },
    rejectedPhotoIds: {
      type: [String],
      default: [],
    },
    orderedPhotoIds: {
      type: [String],
      default: [],
    },
    photoComments: {
      type: [photoCommentSchema],
      default: [],
    },
    coverSpecs: {
      type: coverSpecsSchema,
      default: () => ({}),
    },
    coverMaterial: {
      type: String,
      default: 'Italian Leather - Obsidian Black',
    },
    albumSize: {
      type: String,
      default: '12x12 Master Luxe',
    },
    pageCount: {
      type: Number,
      default: 30,
    },
    clientNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['selecting', 'submitted', 'in_production', 'delivered'],
      default: 'selecting',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

albumSchema.index({ galleryId: 1, clientEmail: 1 }, { unique: true, partialFilterExpression: { galleryId: { $type: 'objectId' } } });
albumSchema.index({ studioId: 1, status: 1, updatedAt: -1 });

const AlbumModel = mongoose.model('Album', albumSchema);

module.exports = AlbumModel;
