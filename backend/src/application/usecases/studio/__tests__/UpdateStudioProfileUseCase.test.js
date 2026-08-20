'use strict';

const UpdateStudioProfileUseCase = require('../UpdateStudioProfileUseCase');
const AppError = require('../../../errors/AppError');

describe('UpdateStudioProfileUseCase', () => {
  let useCase;
  let mockRepo;
  let existingStudio;

  beforeEach(() => {
    existingStudio = {
      id: 'studio_123',
      name: 'Old Studio Name',
      slug: 'old-studio',
      socialLinks: { instagram: 'old_ig' },
      toPublic: jest.fn().mockImplementation(function() { return this; }),
    };

    mockRepo = {
      findById: jest.fn().mockResolvedValue(existingStudio),
      findBySlug: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockImplementation(async (s) => s),
    };

    useCase = new UpdateStudioProfileUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw AppError if studio is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ studioId: 'non_existent' })).rejects.toThrow(AppError);
  });

  it('should throw AppError if updating slug to one that already exists on another studio', async () => {
    mockRepo.findBySlug.mockResolvedValue({ id: 'studio_999' }); // Belongs to someone else
    await expect(useCase.execute({ studioId: 'studio_123', slug: 'taken-slug' })).rejects.toThrow(AppError);
  });

  it('should successfully update slug if it is not taken', async () => {
    mockRepo.findBySlug.mockResolvedValue(null);
    const result = await useCase.execute({ studioId: 'studio_123', slug: 'new-slug' });
    expect(result.slug).toBe('new-slug');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should successfully update basic fields and merge social links', async () => {
    const updateData = {
      studioId: 'studio_123',
      name: 'New Name',
      socialLinks: { twitter: 'new_tw' },
    };
    const result = await useCase.execute(updateData);
    expect(result.name).toBe('New Name');
    expect(result.socialLinks).toEqual({ instagram: 'old_ig', twitter: 'new_tw' });
  });
});
