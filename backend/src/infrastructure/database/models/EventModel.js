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
    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
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
      enum: ['requested', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    price: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ studioId: 1, eventDate: 1 });

const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel;
