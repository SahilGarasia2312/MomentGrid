'use strict';

const AlbumModel = require('../models/AlbumModel');
const Album = require('../../../domain/entities/Album');
const IAlbumRepository = require('../../../domain/repositories/IAlbumRepository');

class MongoAlbumRepository extends IAlbumRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Album({
      id: doc._id.toString(),
      clientEmail: doc.clientEmail,
      clientName: doc.clientName,
      galleryId: doc.galleryId ? doc.galleryId.toString() : null,
      studioId: doc.studioId ? doc.studioId.toString() : null,
      title: doc.title,
      selectedPhotoIds: doc.selectedPhotoIds || [],
      favoritedPhotoIds: doc.favoritedPhotoIds || [],
      rejectedPhotoIds: doc.rejectedPhotoIds || [],
      orderedPhotoIds: doc.orderedPhotoIds || [],
      photoComments: doc.photoComments || [],
      coverSpecs: doc.coverSpecs || {},
      coverMaterial: doc.coverMaterial || doc.coverSpecs?.material || 'Italian Leather - Obsidian Black',
      albumSize: doc.albumSize || '12x12 Master Luxe',
      pageCount: doc.pageCount || 30,
      clientNotes: doc.clientNotes || '',
      status: doc.status || 'selecting',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await AlbumModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByClientOrGallery({ galleryId, clientEmail }) {
    const query = {};
    if (galleryId) query.galleryId = galleryId;
    if (clientEmail) query.clientEmail = clientEmail.toLowerCase().trim();
    
    const doc = await AlbumModel.findOne(query).lean();
    return this._toDomain(doc);
  }

  async create(album) {
    const doc = await AlbumModel.create({
      clientEmail: album.clientEmail,
      clientName: album.clientName,
      galleryId: album.galleryId || null,
      studioId: album.studioId || null,
      title: album.title,
      selectedPhotoIds: album.selectedPhotoIds,
      favoritedPhotoIds: album.favoritedPhotoIds,
      rejectedPhotoIds: album.rejectedPhotoIds,
      orderedPhotoIds: album.orderedPhotoIds,
      photoComments: album.photoComments,
      coverSpecs: album.coverSpecs,
      coverMaterial: album.coverSpecs?.material || album.coverMaterial,
      albumSize: album.albumSize,
      pageCount: album.pageCount,
      clientNotes: album.clientNotes,
      status: album.status,
    });
    return this.findById(doc._id.toString());
  }

  async update(album) {
    await AlbumModel.findByIdAndUpdate(
      album.id,
      {
        $set: {
          clientName: album.clientName,
          title: album.title,
          selectedPhotoIds: album.selectedPhotoIds,
          favoritedPhotoIds: album.favoritedPhotoIds,
          rejectedPhotoIds: album.rejectedPhotoIds,
          orderedPhotoIds: album.orderedPhotoIds,
          photoComments: album.photoComments,
          coverSpecs: album.coverSpecs,
          coverMaterial: album.coverSpecs?.material || album.coverMaterial,
          albumSize: album.albumSize,
          pageCount: album.pageCount,
          clientNotes: album.clientNotes,
          status: album.status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(album.id);
  }

  async listByStudio(studioId, options = {}) {
    const query = {};
    if (studioId) query.studioId = studioId;
    if (options.status && options.status !== 'all') {
      query.status = options.status;
    }
    const docs = await AlbumModel.find(query).sort({ updatedAt: -1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }
}

module.exports = MongoAlbumRepository;
