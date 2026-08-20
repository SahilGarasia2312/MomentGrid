'use strict';

const mongoose = require('mongoose');
const EventTeamAssignment = require('../../../domain/entities/collaboration/EventTeamAssignment');

const teamAssignmentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: EventTeamAssignment.ROLES, default: 'Assistant' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'ACTIVE' }
}, { timestamps: true });

// Prevent duplicate assignment per event
teamAssignmentSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const activitySchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  action: { type: String, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  actorName: { type: String, default: 'System' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false, versionKey: false });

const commentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  referenceType: { type: String, default: 'EVENT' },
  referenceId: { type: String, default: null },
}, { timestamps: true });

module.exports = {
  EventTeamAssignmentModel: mongoose.model('EventTeamAssignment', teamAssignmentSchema),
  EventActivityModel: mongoose.model('EventActivity', activitySchema),
  EventCommentModel: mongoose.model('EventComment', commentSchema)
};
