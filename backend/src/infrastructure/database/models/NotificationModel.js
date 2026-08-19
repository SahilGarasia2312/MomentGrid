'use strict';

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: [true, 'Recipient email is required.'],
      lowercase: true,
      trim: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['client', 'photographer', 'studio_owner', 'admin'],
      default: 'client',
    },
    type: {
      type: String,
      enum: ['booking_update', 'gallery_ready', 'album_ready', 'payment_reminder'],
      required: [true, 'Notification type is required.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required.'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Notification body is required.'],
      trim: true,
    },
    actionUrl: {
      type: String,
      default: '/client/dashboard',
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// High-speed compound index for loading a user's notifications sorted by newest first
notificationSchema.index({ recipientEmail: 1, isRead: 1, createdAt: -1 });

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
