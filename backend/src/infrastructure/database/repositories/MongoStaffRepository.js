'use strict';

const StaffModel = require('../models/StaffModel');
const Staff = require('../../../domain/entities/Staff');
const IStaffRepository = require('../../../domain/repositories/IStaffRepository');

class MongoStaffRepository extends IStaffRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Staff({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      userId: doc.userId ? doc.userId.toString() : null,
      fullName: doc.fullName,
      email: doc.email,
      role: doc.role,
      status: doc.status,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await StaffModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByStudioId(studioId) {
    const docs = await StaffModel.find({ studioId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async findByEmailAndStudio(email, studioId) {
    const doc = await StaffModel.findOne({ email: email.toLowerCase().trim(), studioId }).lean();
    return this._toDomain(doc);
  }

  async save(staff) {
    const doc = await StaffModel.create({
      studioId: staff.studioId,
      userId: staff.userId,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      status: staff.status,
      phone: staff.phone,
    });
    return this.findById(doc._id.toString());
  }

  async update(staff) {
    await StaffModel.findByIdAndUpdate(
      staff.id,
      {
        $set: {
          fullName: staff.fullName,
          role: staff.role,
          status: staff.status,
          phone: staff.phone,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(staff.id);
  }

  async delete(id) {
    await StaffModel.findByIdAndDelete(id);
  }
}

module.exports = MongoStaffRepository;
