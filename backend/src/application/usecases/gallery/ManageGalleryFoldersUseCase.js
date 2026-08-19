'use strict';

const AppError = require('../../errors/AppError');

/**
 * ManageGalleryFoldersUseCase — Application Use Case
 *
 * Handles folder creation, renaming, deletion (with safe migration to root),
 * and moving photos between folders.
 */
class ManageGalleryFoldersUseCase {
  constructor({ galleryRepository }) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ galleryId, studioId, action, folderPayload }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery || (studioId && gallery.studioId !== studioId)) {
      throw new AppError('Gallery not found or access denied.', 404, 'GALLERY_NOT_FOUND');
    }

    if (!action) {
      throw new AppError('Action is required (create, rename, delete, move_photos).', 400, 'INVALID_ACTION');
    }

    if (action === 'create') {
      const name = (folderPayload.name || '').trim();
      if (!name) throw new AppError('Folder name cannot be empty.', 400, 'INVALID_FOLDER_NAME');

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `folder-${Date.now()}`;
      if (gallery.folders.some((f) => f.id === id)) {
        throw new AppError('Folder with this name or ID already exists.', 409, 'FOLDER_EXISTS');
      }

      gallery.folders.push({
        id,
        name,
        parentId: folderPayload.parentId || 'root',
        photoCount: 0,
      });
    } else if (action === 'rename') {
      const folderId = folderPayload.folderId;
      const newName = (folderPayload.name || '').trim();
      if (folderId === 'root') throw new AppError('Cannot rename the root folder.', 400, 'CANNOT_RENAME_ROOT');
      if (!newName) throw new AppError('New folder name is required.', 400, 'INVALID_FOLDER_NAME');

      const folder = gallery.folders.find((f) => f.id === folderId);
      if (!folder) throw new AppError('Target folder not found.', 404, 'FOLDER_NOT_FOUND');
      folder.name = newName;
    } else if (action === 'delete') {
      const folderId = folderPayload.folderId;
      if (folderId === 'root') throw new AppError('Cannot delete the root folder.', 400, 'CANNOT_DELETE_ROOT');

      const folderIdx = gallery.folders.findIndex((f) => f.id === folderId);
      if (folderIdx === -1) throw new AppError('Target folder not found.', 404, 'FOLDER_NOT_FOUND');

      // Safely move photos assigned to this folder back to root
      gallery.photos.forEach((p) => {
        if (p.folderId === folderId) {
          p.folderId = 'root';
        }
      });

      gallery.folders.splice(folderIdx, 1);
    } else if (action === 'move_photos') {
      const { photoIds, targetFolderId } = folderPayload;
      if (!Array.isArray(photoIds) || !targetFolderId) {
        throw new AppError('photoIds array and targetFolderId are required.', 400, 'INVALID_MOVE_PAYLOAD');
      }

      const targetFolder = gallery.folders.find((f) => f.id === targetFolderId);
      if (!targetFolder && targetFolderId !== 'root') {
        throw new AppError('Target destination folder does not exist.', 404, 'FOLDER_NOT_FOUND');
      }

      gallery.photos.forEach((p) => {
        if (photoIds.includes(p.id)) {
          p.folderId = targetFolderId;
        }
      });
    } else {
      throw new AppError(`Unsupported folder action: ${action}`, 400, 'UNSUPPORTED_ACTION');
    }

    // Recalculate photo counts across all folders
    gallery.folders.forEach((f) => {
      if (f.id === 'root') {
        f.photoCount = gallery.photos.length;
      } else {
        f.photoCount = gallery.photos.filter((p) => p.folderId === f.id).length;
      }
    });

    await this.galleryRepository.update(gallery);
    return {
      success: true,
      action,
      folders: gallery.folders,
      totalPhotos: gallery.photos.length,
    };
  }
}

module.exports = ManageGalleryFoldersUseCase;
