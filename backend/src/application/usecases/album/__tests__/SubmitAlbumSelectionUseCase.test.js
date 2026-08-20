'use strict';

const SubmitAlbumSelectionUseCase = require('../SubmitAlbumSelectionUseCase');
const AppError = require('../../../errors/AppError');
const Album = require('../../../../domain/entities/Album');

describe('SubmitAlbumSelectionUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    const mockAlbum = new Album({
      id: 'album_1',
      status: 'selecting',
      favoritedPhotoIds: ['p1', 'p2'],
      orderedPhotoIds: ['p1', 'p2'],
    });
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockAlbum),
      update: jest.fn().mockImplementation((a) => Promise.resolve(a)),
    };
    useCase = new SubmitAlbumSelectionUseCase({ albumRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should successfully submit an album', async () => {
    const result = await useCase.execute({ albumId: 'album_1' });
    expect(result.status).toBe('submitted');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should throw if no photos selected', async () => {
    mockRepo.findById.mockResolvedValueOnce(new Album({ id: 'album_1', status: 'selecting' }));
    await expect(useCase.execute({ albumId: 'album_1' })).rejects.toThrow(AppError);
  });
});
