'use strict';

const UpdatePhotographerProfileUseCase = require('../UpdatePhotographerProfileUseCase');
const AppError = require('../../../errors/AppError');

describe('UpdatePhotographerProfileUseCase', () => {
  let useCase;
  let mockRepo;
  let existingProfile;

  beforeEach(() => {
    existingProfile = {
      id: 'photo_123',
      bio: 'Old bio',
      availability: { monday: true },
    };

    mockRepo = {
      findById: jest.fn().mockResolvedValue(existingProfile),
      update: jest.fn().mockImplementation((id, props) => Promise.resolve({ ...existingProfile, ...props })),
    };

    useCase = new UpdatePhotographerProfileUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw AppError if photographerId is missing', async () => {
    await expect(useCase.execute({ bio: 'New bio' })).rejects.toThrow(AppError);
  });

  it('should throw AppError if profile does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ photographerId: 'photo_999' })).rejects.toThrow(AppError);
  });

  it('should successfully update bio, specializations, and yearsExperience', async () => {
    const updateData = {
      photographerId: 'photo_123',
      bio: 'New bio updated',
      specializations: ['wedding', 'portrait'],
      yearsExperience: 8,
    };

    const result = await useCase.execute(updateData);
    expect(mockRepo.update).toHaveBeenCalledWith('photo_123', expect.objectContaining({
      bio: 'New bio updated',
      specializations: ['wedding', 'portrait'],
      yearsExperience: 8,
    }));
    expect(result.bio).toBe('New bio updated');
    expect(result.yearsExperience).toBe(8);
  });

  it('should successfully merge availability', async () => {
    const updateData = {
      photographerId: 'photo_123',
      availability: { tuesday: false },
    };

    const result = await useCase.execute(updateData);
    expect(mockRepo.update).toHaveBeenCalledWith('photo_123', expect.objectContaining({
      availability: { monday: true, tuesday: false },
    }));
    expect(result.availability.tuesday).toBe(false);
    expect(result.availability.monday).toBe(true);
  });

  it('should update portfolioItems array', async () => {
    const updateData = {
      photographerId: 'photo_123',
      portfolioItems: [{ id: 'p1', url: 'img.jpg' }],
    };

    const result = await useCase.execute(updateData);
    expect(result.portfolioItems.length).toBe(1);
  });
});
