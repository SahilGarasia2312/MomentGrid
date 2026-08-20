'use strict';

const GetPhotographerProfileUseCase = require('../GetPhotographerProfileUseCase');
const AppError = require('../../../errors/AppError');

describe('GetPhotographerProfileUseCase', () => {
  let useCase;
  let mockPhotographerRepo;
  let mockUserRepo;
  let mockProfile;
  let mockUser;

  beforeEach(() => {
    mockProfile = {
      id: 'photo_123',
      userId: 'user_456',
      fullName: 'John Doe',
    };

    mockUser = {
      id: 'user_456',
      email: 'john@example.com',
      fullName: 'John Doe',
      studioId: 'studio_789',
    };

    mockPhotographerRepo = {
      findById: jest.fn().mockResolvedValue(mockProfile),
      findByUserId: jest.fn().mockResolvedValue(mockProfile),
      create: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    };

    mockUserRepo = {
      findById: jest.fn().mockResolvedValue(mockUser),
    };

    useCase = new GetPhotographerProfileUseCase(mockPhotographerRepo, mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return profile if photographerId is provided and exists', async () => {
    const result = await useCase.execute({ photographerId: 'photo_123' });
    expect(mockPhotographerRepo.findById).toHaveBeenCalledWith('photo_123');
    expect(result).toEqual(mockProfile);
  });

  it('should throw 404 AppError if photographerId is provided but not found', async () => {
    mockPhotographerRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ photographerId: 'wrong_id' })).rejects.toThrow(AppError);
    await expect(useCase.execute({ photographerId: 'wrong_id' })).rejects.toMatchObject({
      statusCode: 404,
      code: 'PHOTOGRAPHER_NOT_FOUND',
    });
  });

  it('should throw 400 AppError if neither photographerId nor userId is provided', async () => {
    await expect(useCase.execute({})).rejects.toThrow(AppError);
    await expect(useCase.execute({})).rejects.toMatchObject({
      statusCode: 400,
      code: 'MISSING_IDENTIFIER',
    });
  });

  it('should return existing profile by userId', async () => {
    const result = await useCase.execute({ userId: 'user_456' });
    expect(mockPhotographerRepo.findByUserId).toHaveBeenCalledWith('user_456');
    expect(result).toEqual(mockProfile);
  });

  it('should create and return a new profile if userId is valid but profile does not exist', async () => {
    mockPhotographerRepo.findByUserId.mockResolvedValue(null);
    
    const result = await useCase.execute({ userId: 'user_456' });
    
    expect(mockUserRepo.findById).toHaveBeenCalledWith('user_456');
    expect(mockPhotographerRepo.create).toHaveBeenCalled();
    expect(result.userId).toBe('user_456');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw 404 AppError if userId is provided, profile does not exist, and user does not exist', async () => {
    mockPhotographerRepo.findByUserId.mockResolvedValue(null);
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId: 'invalid_user' })).rejects.toThrow(AppError);
  });
});
