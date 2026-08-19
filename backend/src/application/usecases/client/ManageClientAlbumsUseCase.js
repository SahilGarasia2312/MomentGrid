'use strict';

const AppError = require('../../errors/AppError');
const Album = require('../../../domain/entities/Album');

class ManageClientAlbumsUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async listAlbums({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to list albums.', 400, 'CLIENT_EMAIL_REQUIRED');
    }
    return this.clientRepository.findAlbumsByClientEmail(clientEmail);
  }

  async createAlbum({ clientEmail, galleryId, title, selectedPhotoIds, coverMaterial, pageCount, clientNotes }) {
    if (!clientEmail || !galleryId || !title) {
      throw new AppError('Gallery ID and Title are required.', 400, 'VALIDATION_ERROR');
    }

    const gallery = await this.clientRepository.findGalleryById(galleryId);
    if (!gallery || gallery.clientEmail !== clientEmail.toLowerCase().trim()) {
      throw new AppError('Gallery not found or unauthorized.', 403, 'FORBIDDEN');
    }

    const newAlbum = new Album({
      clientEmail: clientEmail.toLowerCase().trim(),
      galleryId,
      studioId: gallery.studioId,
      title: title.trim(),
      selectedPhotoIds: Array.isArray(selectedPhotoIds) ? selectedPhotoIds : [],
      coverMaterial: coverMaterial || 'Italian Leather - Obsidian Black',
      pageCount: pageCount || 30,
      clientNotes: clientNotes || '',
      status: 'selecting',
    });

    return this.clientRepository.saveAlbum(newAlbum);
  }

  async updateAlbum({ clientEmail, albumId, title, selectedPhotoIds, coverMaterial, pageCount, clientNotes, status }) {
    if (!albumId) {
      throw new AppError('Album ID is required.', 400, 'ALBUM_ID_REQUIRED');
    }

    const album = await this.clientRepository.findAlbumById(albumId);
    if (!album || album.clientEmail !== clientEmail.toLowerCase().trim()) {
      throw new AppError('Album not found or unauthorized.', 403, 'FORBIDDEN');
    }

    if (album.status !== 'selecting' && status !== 'selecting') {
      throw new AppError('This album has already been submitted for print production.', 400, 'ALREADY_SUBMITTED');
    }

    if (title !== undefined) album.title = title;
    if (selectedPhotoIds !== undefined) album.selectedPhotoIds = Array.isArray(selectedPhotoIds) ? selectedPhotoIds : [];
    if (coverMaterial !== undefined) album.coverMaterial = coverMaterial;
    if (pageCount !== undefined) album.pageCount = Number(pageCount);
    if (clientNotes !== undefined) album.clientNotes = clientNotes;
    if (status !== undefined) album.status = status;

    return this.clientRepository.updateAlbum(album);
  }
}

module.exports = ManageClientAlbumsUseCase;
