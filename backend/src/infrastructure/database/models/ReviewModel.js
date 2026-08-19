'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Review must belong to a studioId.'],
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required.'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5).'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ studioId: 1, isPublic: 1, createdAt: -1 });

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
