'use strict';

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Event must belong to a studioId.'],
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    bookingId: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
    },
    eventType: {
      type: String,
      default: 'wedding',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required.'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required.'],
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      default: null,
    },
    eventDate: {
      type: String,
      required: [true, 'Event date is required (YYYY-MM-DD).'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (HH:mm).'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (HH:mm).'],
    },
    location: {
      type: String,
      default: '',
    },
    expectedGuestCount: {
      type: Number,
      default: 0,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
    },
    assignedStaffIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
      },
    ],
    status: {
      type: String,
      enum: [
        // New explicit production lifecycle
        'DRAFT', 'PLANNED', 'CONFIRMED', 'READY_FOR_SHOOT', 'IN_PROGRESS', 
        'SHOOT_COMPLETED', 'POST_PRODUCTION', 'CLIENT_REVIEW', 'DELIVERED', 
        'COMPLETED', 'CANCELLED',
        // Legacy booking states for backward compatibility
        'requested', 'confirmed', 'completed', 'cancelled'
      ],
      default: 'DRAFT',
    },
    price: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    internalNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ studioId: 1, eventDate: 1 });
eventSchema.index({ status: 1 });

const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel;
