'use strict';

const ManageGalleryFoldersUseCase = require('../ManageGalleryFoldersUseCase');
const AppError = require('../../../errors/AppError');

describe('ManageGalleryFoldersUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue({
        id: 'gal_1',
        folders: [
          { id: 'root', name: 'All Photos', photoCount: 2 },
          { id: 'getting-ready', name: 'Getting Ready', photoCount: 1 },
        ],
        photos: [
          { id: 'p1', folderId: 'getting-ready' },
          { id: 'p2', folderId: 'root' },
        ],
      }),
      update: jest.fn(),
    };
    useCase = new ManageGalleryFoldersUseCase({ galleryRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a new folder safely', async () => {
    const result = await useCase.execute({ galleryId: 'gal_1', action: 'create', folderPayload: { name: 'Ceremony' } });
    expect(mockRepo.update).toHaveBeenCalled();
    const updatedGallery = mockRepo.update.mock.calls[0][0];
    expect(updatedGallery.folders).toHaveLength(3);
    expect(updatedGallery.folders[2].name).toBe('Ceremony');
    expect(updatedGallery.folders[2].id).toBe('ceremony');
  });

  it('should rename a folder safely', async () => {
    await useCase.execute({ galleryId: 'gal_1', action: 'rename', folderPayload: { folderId: 'getting-ready', name: 'Prep' } });
    const updatedGallery = mockRepo.update.mock.calls[0][0];
    expect(updatedGallery.folders.find((f) => f.id === 'getting-ready').name).toBe('Prep');
  });

  it('should prevent deleting the root folder', async () => {
    await expect(useCase.execute({ galleryId: 'gal_1', action: 'delete', folderPayload: { folderId: 'root' } })).rejects.toThrow(AppError);
  });

  it('should delete a folder and move its photos to root', async () => {
    await useCase.execute({ galleryId: 'gal_1', action: 'delete', folderPayload: { folderId: 'getting-ready' } });
    const updatedGallery = mockRepo.update.mock.calls[0][0];
    expect(updatedGallery.folders).toHaveLength(1); // only root left
    expect(updatedGallery.photos[0].folderId).toBe('root'); // moved from getting-ready
  });

  it('should move photos to another folder', async () => {
    await useCase.execute({ galleryId: 'gal_1', action: 'move_photos', folderPayload: { photoIds: ['p2'], targetFolderId: 'getting-ready' } });
    const updatedGallery = mockRepo.update.mock.calls[0][0];
    expect(updatedGallery.photos.find((p) => p.id === 'p2').folderId).toBe('getting-ready');
    expect(updatedGallery.folders.find((f) => f.id === 'getting-ready').photoCount).toBe(2);
  });
});
