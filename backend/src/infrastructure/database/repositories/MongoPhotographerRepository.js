'use strict';

const IPhotographerRepository = require('../../../domain/repositories/IPhotographerRepository');
const Photographer = require('../../../domain/entities/Photographer');
const PhotographerModel = require('../models/PhotographerModel');

class MongoPhotographerRepository extends IPhotographerRepository {
  /**
   * Converts Mongoose document to domain entity
   */
  _toDomain(doc) {
    if (!doc) return null;
    return new Photographer({
      id: doc._id.toString(),
      userId: doc.userId ? doc.userId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      fullName: doc.fullName,
      email: doc.email,
      bio: doc.bio,
      avatarUrl: doc.avatarUrl,
      portfolioUrl: doc.portfolioUrl,
      specializations: doc.specializations || [],
      yearsExperience: doc.yearsExperience,
      availability: doc.availability,
      blockedDates: doc.blockedDates || [],
      stats: doc.stats,
      portfolioItems: doc.portfolioItems || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(photographerId) {
    const doc = await PhotographerModel.findById(photographerId);
    return this._toDomain(doc);
  }

  async findByUserId(userId) {
    const doc = await PhotographerModel.findOne({ userId });
    return this._toDomain(doc);
  }

  async findByStudioId(studioId) {
    const docs = await PhotographerModel.find({ studioId }).sort({ createdAt: -1 });
    return docs.map((doc) => this._toDomain(doc));
  }

  async create(photographerEntity) {
    const doc = await PhotographerModel.create({
      userId: photographerEntity.userId,
      studioId: photographerEntity.studioId,
      fullName: photographerEntity.fullName,
      email: photographerEntity.email,
      bio: photographerEntity.bio,
      avatarUrl: photographerEntity.avatarUrl,
      portfolioUrl: photographerEntity.portfolioUrl,
      specializations: photographerEntity.specializations,
      yearsExperience: photographerEntity.yearsExperience,
      availability: photographerEntity.availability,
      blockedDates: photographerEntity.blockedDates,
      stats: photographerEntity.stats,
      portfolioItems: photographerEntity.portfolioItems,
    });
    return this._toDomain(doc);
  }

  async update(photographerId, updateProps) {
    const doc = await PhotographerModel.findByIdAndUpdate(
      photographerId,
      { $set: updateProps },
      { new: true, runValidators: true }
    );
    return this._toDomain(doc);
  }

  async blockDates(photographerId, blockedDatesArray) {
    const doc = await PhotographerModel.findByIdAndUpdate(
      photographerId,
      { $set: { blockedDates: blockedDatesArray } },
      { new: true }
    );
    return this._toDomain(doc);
  }
}

module.exports = MongoPhotographerRepository;
