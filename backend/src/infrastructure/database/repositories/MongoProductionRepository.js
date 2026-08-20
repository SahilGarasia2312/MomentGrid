'use strict';

const { EventTimelineModel, EventTaskModel, EventShotModel, EventDeliverableModel } = require('../models/EventProductionModels');
const EventTimelineItem = require('../../../domain/entities/production/EventTimelineItem');
const EventTask = require('../../../domain/entities/production/EventTask');
const EventShot = require('../../../domain/entities/production/EventShot');
const EventDeliverable = require('../../../domain/entities/production/EventDeliverable');

class MongoProductionRepository {
  // --- Timeline ---
  async getTimeline(eventId) {
    const docs = await EventTimelineModel.find({ eventId }).sort({ startTime: 1 }).lean();
    return docs.map(d => new EventTimelineItem({ ...d, id: d._id.toString(), eventId: d.eventId.toString() }));
  }
  async addTimelineItem(item) {
    const doc = await EventTimelineModel.create(item);
    return new EventTimelineItem({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString() });
  }
  async updateTimelineItem(id, updates) {
    const doc = await EventTimelineModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    return doc ? new EventTimelineItem({ ...doc, id: doc._id.toString(), eventId: doc.eventId.toString() }) : null;
  }
  async removeTimelineItem(id) {
    await EventTimelineModel.findByIdAndDelete(id);
  }

  // --- Tasks ---
  async getTasks(eventId) {
    const docs = await EventTaskModel.find({ eventId }).lean();
    return docs.map(d => new EventTask({ ...d, id: d._id.toString(), eventId: d.eventId.toString() }));
  }
  async addTask(item) {
    const doc = await EventTaskModel.create(item);
    return new EventTask({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString() });
  }
  async updateTask(id, updates) {
    const doc = await EventTaskModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    return doc ? new EventTask({ ...doc, id: doc._id.toString(), eventId: doc.eventId.toString() }) : null;
  }
  async removeTask(id) {
    await EventTaskModel.findByIdAndDelete(id);
  }

  // --- Shots ---
  async getShots(eventId) {
    const docs = await EventShotModel.find({ eventId }).lean();
    return docs.map(d => new EventShot({ ...d, id: d._id.toString(), eventId: d.eventId.toString() }));
  }
  async addShot(item) {
    const doc = await EventShotModel.create(item);
    return new EventShot({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString() });
  }
  async updateShot(id, updates) {
    const doc = await EventShotModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    return doc ? new EventShot({ ...doc, id: doc._id.toString(), eventId: doc.eventId.toString() }) : null;
  }
  async removeShot(id) {
    await EventShotModel.findByIdAndDelete(id);
  }

  // --- Deliverables ---
  async getDeliverables(eventId) {
    const docs = await EventDeliverableModel.find({ eventId }).sort({ deadline: 1 }).lean();
    return docs.map(d => new EventDeliverable({ ...d, id: d._id.toString(), eventId: d.eventId.toString() }));
  }
  async addDeliverable(item) {
    const doc = await EventDeliverableModel.create(item);
    return new EventDeliverable({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString() });
  }
  async updateDeliverable(id, updates) {
    const doc = await EventDeliverableModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    return doc ? new EventDeliverable({ ...doc, id: doc._id.toString(), eventId: doc.eventId.toString() }) : null;
  }
  async removeDeliverable(id) {
    await EventDeliverableModel.findByIdAndDelete(id);
  }
}

module.exports = MongoProductionRepository;
