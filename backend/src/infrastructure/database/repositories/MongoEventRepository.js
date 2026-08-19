'use strict';

const EventModel = require('../models/EventModel');
const Event = require('../../../domain/entities/Event');
const IEventRepository = require('../../../domain/repositories/IEventRepository');

class MongoEventRepository extends IEventRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Event({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      title: doc.title,
      clientName: doc.clientName,
      clientEmail: doc.clientEmail,
      clientPhone: doc.clientPhone,
      eventDate: doc.eventDate,
      startTime: doc.startTime,
      endTime: doc.endTime,
      packageId: doc.packageId ? doc.packageId.toString() : null,
      assignedStaffIds: Array.isArray(doc.assignedStaffIds)
        ? doc.assignedStaffIds.map((id) => id.toString())
        : [],
      status: doc.status,
      price: doc.price,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await EventModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByStudioId(studioId) {
    const docs = await EventModel.find({ studioId }).sort({ eventDate: 1, startTime: 1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async findByStaffId(staffId) {
    const docs = await EventModel.find({ assignedStaffIds: staffId }).sort({ eventDate: 1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async save(event) {
    const doc = await EventModel.create({
      studioId: event.studioId,
      title: event.title,
      clientName: event.clientName,
      clientEmail: event.clientEmail,
      clientPhone: event.clientPhone,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      packageId: event.packageId,
      assignedStaffIds: event.assignedStaffIds,
      status: event.status,
      price: event.price,
      notes: event.notes,
    });
    return this.findById(doc._id.toString());
  }

  async update(event) {
    await EventModel.findByIdAndUpdate(
      event.id,
      {
        $set: {
          title: event.title,
          clientName: event.clientName,
          clientEmail: event.clientEmail,
          clientPhone: event.clientPhone,
          eventDate: event.eventDate,
          startTime: event.startTime,
          endTime: event.endTime,
          packageId: event.packageId,
          assignedStaffIds: event.assignedStaffIds,
          status: event.status,
          price: event.price,
          notes: event.notes,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(event.id);
  }

  async delete(id) {
    await EventModel.findByIdAndDelete(id);
  }
}

module.exports = MongoEventRepository;
