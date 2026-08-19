'use strict';

const PackageModel = require('../models/PackageModel');
const Package = require('../../../domain/entities/Package');
const IPackageRepository = require('../../../domain/repositories/IPackageRepository');

class MongoPackageRepository extends IPackageRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Package({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      durationMinutes: doc.durationMinutes,
      deliverablesCount: doc.deliverablesCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await PackageModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByStudioId(studioId) {
    const docs = await PackageModel.find({ studioId }).sort({ price: 1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async save(pkg) {
    const doc = await PackageModel.create({
      studioId: pkg.studioId,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      durationMinutes: pkg.durationMinutes,
      deliverablesCount: pkg.deliverablesCount,
      isActive: pkg.isActive,
    });
    return this.findById(doc._id.toString());
  }

  async update(pkg) {
    await PackageModel.findByIdAndUpdate(
      pkg.id,
      {
        $set: {
          title: pkg.title,
          description: pkg.description,
          price: pkg.price,
          durationMinutes: pkg.durationMinutes,
          deliverablesCount: pkg.deliverablesCount,
          isActive: pkg.isActive,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(pkg.id);
  }

  async delete(id) {
    await PackageModel.findByIdAndDelete(id);
  }
}

module.exports = MongoPackageRepository;
