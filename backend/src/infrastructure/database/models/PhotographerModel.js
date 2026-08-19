'use strict';

const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'wedding' },
    imageUrl: { type: String, required: true },
    clientName: { type: String, default: 'Client Session' },
  },
  { _id: false }
);

const photographerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Photographer must be tied to a User ID.'],
      unique: true,
      index: true,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      default: null,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: 'Professional cinematic portrait and event photographer.',
    },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    portfolioUrl: {
      type: String,
      default: 'https://momentgrid.io/photographers/portfolio',
    },
    specializations: {
      type: [String],
      default: ['wedding', 'portrait', 'editorial'],
    },
    yearsExperience: {
      type: Number,
      default: 5,
    },
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: false },
    },
    blockedDates: {
      type: [String],
      default: [],
    },
    stats: {
      totalSessions: { type: Number, default: 42 },
      totalPhotosDelivered: { type: Number, default: 4890 },
      averageRating: { type: Number, default: 4.9 },
      totalReviews: { type: Number, default: 38 },
    },
    portfolioItems: {
      type: [portfolioItemSchema],
      default: [
        { id: 'port-1', title: 'Golden Hour Bridal Portraiture', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', clientName: 'Sarah & Michael' },
        { id: 'port-2', title: 'Vogue Summer Editorial Series', category: 'editorial', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', clientName: 'Vogue Collective' },
        { id: 'port-3', title: 'Cinematic Sunset Rings', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', clientName: 'Aria & David' },
        { id: 'port-4', title: 'Monochrome Studio Headshot', category: 'portrait', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', clientName: 'Devon Vance' },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const PhotographerModel = mongoose.model('Photographer', photographerSchema);

module.exports = PhotographerModel;
