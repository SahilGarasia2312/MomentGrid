'use strict';

const UploadGalleryImagesUseCase = require('../UploadGalleryImagesUseCase');
const AppError = require('../../../errors/AppError');

describe('UploadGalleryImagesUseCase', () => {
  let useCase;
  let mockRepo;
  let mockStorage;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue({
        id: 'gal_1',
        studioId: 'studio_1',
        categories: ['wedding'],
        folders: [{ id: 'root', photoCount: 0 }, { id: 'getting-ready', photoCount: 0 }],
        photos: [],
      }),
      update: jest.fn(),
    };
    mockStorage = {
      getOptimizedUrl: jest.fn().mockReturnValue('http://optimized.url'),
    };
    useCase = new UploadGalleryImagesUseCase({ galleryRepository: mockRepo, storageService: mockStorage });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if no photos provided', async () => {
    await expect(useCase.execute({ galleryId: 'gal_1', studioId: 'studio_1', photos: [] })).rejects.toThrow(AppError);
  });

  it('should add photos, update folder photo counts, and set coverUrl', async () => {
    const photos = [{ url: 'http://test.com/photo1.jpg' }];
    const result = await useCase.execute({ galleryId: 'gal_1', studioId: 'studio_1', photos, targetFolderId: 'getting-ready', category: 'editorial' });
    
    expect(mockRepo.update).toHaveBeenCalled();
    const updatedGallery = mockRepo.update.mock.calls[0][0];
    
    expect(updatedGallery.photos).toHaveLength(1);
    expect(updatedGallery.photos[0].folderId).toBe('getting-ready');
    expect(updatedGallery.photos[0].category).toBe('editorial');
    expect(updatedGallery.photos[0].url).toBe('http://optimized.url');
    
    expect(updatedGallery.categories).toContain('editorial');
    expect(updatedGallery.coverUrl).toBe('http://optimized.url');
    
    expect(updatedGallery.folders.find((f) => f.id === 'getting-ready').photoCount).toBe(1);
    expect(updatedGallery.folders.find((f) => f.id === 'root').photoCount).toBe(1);
  });
});
