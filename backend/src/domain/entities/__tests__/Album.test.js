'use strict';

const Album = require('../Album');
const AppError = require('../../../application/errors/AppError');

describe('Album domain entity', () => {
  const makeAlbum = (overrides = {}) => new Album({ clientEmail: 'client@test.com', ...overrides });

  describe('constructor', () => {
    it('should set default values correctly', () => {
      const album = makeAlbum();
      expect(album.clientEmail).toBe('client@test.com');
      expect(album.status).toBe(Album.STATUSES.SELECTING);
      expect(album.favoritedPhotoIds).toEqual([]);
      expect(album.rejectedPhotoIds).toEqual([]);
      expect(album.pageCount).toBe(30);
    });
  });

  describe('toggleFavorite', () => {
    it('should add to favorited and ordered if not present', () => {
      const album = makeAlbum();
      album.toggleFavorite('photo1');
      expect(album.favoritedPhotoIds).toContain('photo1');
      expect(album.orderedPhotoIds).toContain('photo1');
    });

    it('should remove from favorited and ordered if present', () => {
      const album = makeAlbum({ favoritedPhotoIds: ['photo1'], orderedPhotoIds: ['photo1'] });
      album.toggleFavorite('photo1');
      expect(album.favoritedPhotoIds).not.toContain('photo1');
      expect(album.orderedPhotoIds).not.toContain('photo1');
    });

    it('should remove from rejected if currently rejected', () => {
      const album = makeAlbum({ rejectedPhotoIds: ['photo1'] });
      album.toggleFavorite('photo1');
      expect(album.rejectedPhotoIds).not.toContain('photo1');
      expect(album.favoritedPhotoIds).toContain('photo1');
    });

    it('should throw if album is not in selecting status', () => {
      const album = makeAlbum({ status: Album.STATUSES.SUBMITTED });
      expect(() => album.toggleFavorite('photo1')).toThrow(AppError);
    });
  });

  describe('toggleReject', () => {
    it('should add to rejected and remove from favorited if present', () => {
      const album = makeAlbum({ favoritedPhotoIds: ['photo1'], orderedPhotoIds: ['photo1'] });
      album.toggleReject('photo1');
      expect(album.rejectedPhotoIds).toContain('photo1');
      expect(album.favoritedPhotoIds).not.toContain('photo1');
    });
  });

  describe('addOrUpdateComment', () => {
    it('should add a new comment', () => {
      const album = makeAlbum();
      album.addOrUpdateComment('photo1', 'make it black and white');
      expect(album.photoComments).toHaveLength(1);
      expect(album.photoComments[0].photoId).toBe('photo1');
      expect(album.photoComments[0].comment).toBe('make it black and white');
    });

    it('should remove comment if text is empty', () => {
      const album = makeAlbum({ photoComments: [{ photoId: 'photo1', comment: 'test' }] });
      album.addOrUpdateComment('photo1', '  ');
      expect(album.photoComments).toHaveLength(0);
    });
  });

  describe('submitSelection', () => {
    it('should throw if no photos are selected', () => {
      const album = makeAlbum();
      expect(() => album.submitSelection()).toThrow(AppError);
      expect(() => album.submitSelection()).toThrow(/select at least 1 photo/);
    });

    it('should update status to SUBMITTED', () => {
      const album = makeAlbum({ favoritedPhotoIds: ['photo1'] });
      album.submitSelection();
      expect(album.status).toBe(Album.STATUSES.SUBMITTED);
    });
  });
});
