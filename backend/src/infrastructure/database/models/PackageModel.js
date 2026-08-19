'use strict';

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Package must belong to a studioId.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Package title is required.'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: 0,
    },
    durationMinutes: {
      type: Number,
      default: 120,
    },
    deliverablesCount: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({ studioId: 1, title: 1 });

const PackageModel = mongoose.model('Package', packageSchema);

module.exports = PackageModel;
