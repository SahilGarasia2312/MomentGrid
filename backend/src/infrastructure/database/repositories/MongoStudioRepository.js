'use strict';

const StudioModel = require('../models/StudioModel');
const Studio = require('../../../domain/entities/Studio');
const IStudioRepository = require('../../../domain/repositories/IStudioRepository');

class MongoStudioRepository extends IStudioRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Studio({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      ownerId: doc.ownerId.toString(),
      logoUrl: doc.logoUrl,
      brandColor: doc.brandColor,
      contactEmail: doc.contactEmail,
      phone: doc.phone,
      about: doc.about,
      socialLinks: doc.socialLinks,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await StudioModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByOwnerId(ownerId) {
    const doc = await StudioModel.findOne({ ownerId }).lean();
    return this._toDomain(doc);
  }

  async findBySlug(slug) {
    const doc = await StudioModel.findOne({ slug: slug.toLowerCase() }).lean();
    return this._toDomain(doc);
  }

  async save(studio) {
    const doc = await StudioModel.create({
      name: studio.name,
      slug: studio.slug,
      ownerId: studio.ownerId,
      logoUrl: studio.logoUrl,
      brandColor: studio.brandColor,
      contactEmail: studio.contactEmail,
      phone: studio.phone,
      about: studio.about,
      socialLinks: studio.socialLinks,
    });
    return this.findById(doc._id.toString());
  }

  async update(studio) {
    await StudioModel.findByIdAndUpdate(
      studio.id,
      {
        $set: {
          name: studio.name,
          slug: studio.slug,
          logoUrl: studio.logoUrl,
          brandColor: studio.brandColor,
          contactEmail: studio.contactEmail,
          phone: studio.phone,
          about: studio.about,
          socialLinks: studio.socialLinks,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(studio.id);
  }

  async delete(id) {
    await StudioModel.findByIdAndDelete(id);
  }
}

module.exports = MongoStudioRepository;
