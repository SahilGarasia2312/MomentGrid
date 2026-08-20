'use strict';

const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  assignedStaffIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
  status: { type: String, default: 'PENDING' }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  task: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, default: 'MEDIUM' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  dueDate: { type: Date, default: null },
  status: { type: String, default: 'TODO' }
}, { timestamps: true });

const shotSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  shot: { type: String, required: true },
  category: { type: String, default: 'GENERAL' },
  priority: { type: String, default: 'MEDIUM' },
  referenceImage: { type: String, default: null },
  assignedPhotographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  status: { type: String, default: 'PENDING' },
  notes: { type: String, default: '' }
}, { timestamps: true });

const deliverableSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  title: { type: String, required: true },
  status: { type: String, default: 'PENDING' },
  deadline: { type: Date, default: null },
  responsiblePersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  deliveryDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = {
  EventTimelineModel: mongoose.model('EventTimelineItem', timelineSchema),
  EventTaskModel: mongoose.model('EventTask', taskSchema),
  EventShotModel: mongoose.model('EventShot', shotSchema),
  EventDeliverableModel: mongoose.model('EventDeliverable', deliverableSchema)
};
