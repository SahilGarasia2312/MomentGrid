'use strict';

const Gallery = require('../Gallery');

describe('Gallery domain entity', () => {
  it('should construct with correct defaults and hierarchical folders', () => {
    const gallery = new Gallery({
      studioId: 'studio_1',
      title: 'Wedding Album',
      clientEmail: 'Client@Test.com',
    });
    
    expect(gallery.clientEmail).toBe('client@test.com');
    expect(gallery.status).toBe(Gallery.STATUSES.PUBLISHED);
    expect(gallery.folders).toHaveLength(4);
    expect(gallery.folders[0].id).toBe('root');
    expect(gallery.categories).toContain('wedding');
    expect(gallery.watermarkConfig.enabled).toBe(true);
    expect(gallery.sharingConfig.isPublic).toBe(true);
    expect(gallery.photos).toEqual([]);
  });

  it('should expand photo metadata safely', () => {
    const gallery = new Gallery({
      studioId: 'studio_1',
      title: 'Wedding Album',
      clientEmail: 'client@test.com',
      photos: [{ url: 'http://test.com/img1.jpg' }],
    });
    
    expect(gallery.photos).toHaveLength(1);
    expect(gallery.photos[0].id).toBeDefined();
    expect(gallery.photos[0].folderId).toBe('root');
    expect(gallery.photos[0].category).toBe('general');
    expect(gallery.photos[0].isFavorite).toBe(false);
  });
});
