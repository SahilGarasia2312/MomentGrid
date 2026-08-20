'use strict';

const UpdatePhotoSelectionStatusUseCase = require('../UpdatePhotoSelectionStatusUseCase');
const AppError = require('../../../errors/AppError');
const Album = require('../../../../domain/entities/Album');

describe('UpdatePhotoSelectionStatusUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    const mockAlbum = new Album({ id: 'album_1', status: 'selecting' });
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockAlbum),
      update: jest.fn().mockImplementation((a) => Promise.resolve(a)),
    };
    useCase = new UpdatePhotoSelectionStatusUseCase({ albumRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should toggle favorite status', async () => {
    const result = await useCase.execute({ albumId: 'album_1', action: 'toggle_favorite', photoId: 'p1' });
    expect(result.favoritedPhotoIds).toContain('p1');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should toggle reject status', async () => {
    const result = await useCase.execute({ albumId: 'album_1', action: 'toggle_reject', photoId: 'p2' });
    expect(result.rejectedPhotoIds).toContain('p2');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should update spread sequence', async () => {
    const result = await useCase.execute({ albumId: 'album_1', action: 'set_order', orderedPhotoIds: ['p1', 'p2'] });
    expect(result.orderedPhotoIds).toEqual(['p1', 'p2']);
  });

  it('should throw AppError on invalid action', async () => {
    await expect(useCase.execute({ albumId: 'album_1', action: 'invalid' })).rejects.toThrow(AppError);
  });
});
