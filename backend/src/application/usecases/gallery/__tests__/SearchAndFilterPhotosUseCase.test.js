'use strict';

const SearchAndFilterPhotosUseCase = require('../SearchAndFilterPhotosUseCase');
const AppError = require('../../../errors/AppError');

describe('SearchAndFilterPhotosUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue({
        id: 'gal_1',
        photos: [
          { id: 'p1', url: 'img1.jpg', caption: 'bride', category: 'wedding', folderId: 'root', isFavorite: true },
          { id: 'p2', url: 'img2.jpg', caption: 'groom', category: 'editorial', folderId: 'getting-ready', isFavorite: false },
          { id: 'p3', url: 'img3.jpg', caption: 'ring', category: 'wedding', folderId: 'getting-ready', isFavorite: true },
        ],
      }),
    };
    useCase = new SearchAndFilterPhotosUseCase({ galleryRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all photos paginated by default', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', limit: 2 });
    expect(result.photos).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(3);
    expect(result.pagination.hasNextPage).toBe(true);
  });

  it('should filter by folderId', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', folderId: 'getting-ready' });
    expect(result.photos).toHaveLength(2);
    expect(result.photos.map(p => p.id)).toEqual(['p2', 'p3']);
  });

  it('should filter by category', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', category: 'wedding' });
    expect(result.photos).toHaveLength(2);
    expect(result.photos.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('should filter by favorites', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', favoritesOnly: true });
    expect(result.photos).toHaveLength(2);
    expect(result.photos.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  it('should filter by searchQuery on caption', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', searchQuery: 'groom' });
    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].id).toBe('p2');
  });
});
