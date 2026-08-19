'use strict';

const GalleryModel = require('../models/GalleryModel');
const Gallery = require('../../../domain/entities/Gallery');
const IGalleryRepository = require('../../../domain/repositories/IGalleryRepository');

class MongoGalleryRepository extends IGalleryRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Gallery({
      id: doc._id.toString(),
      studioId: doc.studioId ? doc.studioId.toString() : doc.studioId,
      title: doc.title,
      eventId: doc.eventId ? doc.eventId.toString() : null,
      packageId: doc.packageId ? doc.packageId.toString() : null,
      clientEmail: doc.clientEmail,
      pinCode: doc.pinCode,
      coverUrl: doc.coverUrl,
      photos: Array.isArray(doc.photos)
        ? doc.photos.map((p) => ({
            id: p.id || (p._id ? p._id.toString() : `photo-${Date.now()}`),
            url: p.url,
            caption: p.caption,
            category: p.category || 'general',
            folderId: p.folderId || 'root',
            width: p.width || 3840,
            height: p.height || 2160,
            format: p.format || 'jpg',
            bytes: p.bytes || 2048000,
            isFavorite: p.isFavorite || false,
            createdAt: p.createdAt || doc.createdAt,
          }))
        : [],
      folders: Array.isArray(doc.folders)
        ? doc.folders.map((f) => ({
            id: f.id || (f._id ? f._id.toString() : 'root'),
            name: f.name,
            parentId: f.parentId || null,
            photoCount: f.photoCount || 0,
          }))
        : [],
      categories: Array.isArray(doc.categories) ? doc.categories : [],
      watermarkConfig: doc.watermarkConfig || {},
      sharingConfig: doc.sharingConfig || {},
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await GalleryModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByStudioId(studioId) {
    const docs = await GalleryModel.find({ studioId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async findByClientEmail(clientEmail) {
    const docs = await GalleryModel.find({ clientEmail: clientEmail.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async save(gallery) {
    const doc = await GalleryModel.create({
      studioId: gallery.studioId,
      title: gallery.title,
      eventId: gallery.eventId,
      packageId: gallery.packageId,
      clientEmail: gallery.clientEmail,
      pinCode: gallery.pinCode,
      coverUrl: gallery.coverUrl,
      photos: gallery.photos,
      folders: gallery.folders,
      categories: gallery.categories,
      watermarkConfig: gallery.watermarkConfig,
      sharingConfig: gallery.sharingConfig,
      status: gallery.status,
    });
    return this.findById(doc._id.toString());
  }

  async update(gallery) {
    await GalleryModel.findByIdAndUpdate(
      gallery.id,
      {
        $set: {
          title: gallery.title,
          eventId: gallery.eventId,
          packageId: gallery.packageId,
          clientEmail: gallery.clientEmail,
          pinCode: gallery.pinCode,
          coverUrl: gallery.coverUrl,
          photos: gallery.photos,
          folders: gallery.folders,
          categories: gallery.categories,
          watermarkConfig: gallery.watermarkConfig,
          sharingConfig: gallery.sharingConfig,
          status: gallery.status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(gallery.id);
  }

  async delete(id) {
    await GalleryModel.findByIdAndDelete(id);
  }
}

module.exports = MongoGalleryRepository;
