'use strict';

const GetStudioProfileUseCase = require('../GetStudioProfileUseCase');
const AppError = require('../../../errors/AppError');

// Mock domain entity
jest.mock('../../../../domain/entities/Studio', () => {
  return class Studio {
    constructor(data) {
      Object.assign(this, data);
      this.id = 'studio_new';
    }
    toPublic() {
      return { id: this.id, name: this.name, slug: this.slug };
    }
  };
});

describe('GetStudioProfileUseCase', () => {
  let useCase;
  let mockStudioRepo;
  let mockUserRepo;
  let mockUser;
  let mockStudio;

  beforeEach(() => {
    mockUser = {
      id: 'owner_123',
      fullName: 'Owner Name',
      email: 'owner@test.com',
      phone: '123456',
      role: 'studio_owner',
      studioId: null,
    };

    mockStudio = {
      id: 'studio_123',
      name: 'Test Studio',
      toPublic: jest.fn().mockReturnValue({ id: 'studio_123', name: 'Test Studio' }),
    };

    mockStudioRepo = {
      findById: jest.fn().mockResolvedValue(mockStudio),
      findByOwnerId: jest.fn().mockResolvedValue(mockStudio),
      save: jest.fn().mockImplementation(async (s) => s),
    };

    mockUserRepo = {
      findById: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(),
    };

    useCase = new GetStudioProfileUseCase(mockStudioRepo, mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find studio by studioId', async () => {
    const result = await useCase.execute({ studioId: 'studio_123' });
    expect(mockStudioRepo.findById).toHaveBeenCalledWith('studio_123');
    expect(result.name).toBe('Test Studio');
  });

  it('should find studio by ownerId', async () => {
    const result = await useCase.execute({ ownerId: 'owner_123' });
    expect(mockStudioRepo.findByOwnerId).toHaveBeenCalledWith('owner_123');
    expect(result.name).toBe('Test Studio');
  });

  it('should auto-initialize studio if ownerId provided and not found', async () => {
    mockStudioRepo.findByOwnerId.mockResolvedValue(null);
    const result = await useCase.execute({ ownerId: 'owner_123' });
    expect(mockUserRepo.findById).toHaveBeenCalledWith('owner_123');
    expect(mockStudioRepo.save).toHaveBeenCalled();
    expect(mockUserRepo.update).toHaveBeenCalled();
    expect(result.name).toBe("Owner Name's Studio");
  });

  it('should throw AppError if studio not found and cannot auto-init', async () => {
    mockStudioRepo.findByOwnerId.mockResolvedValue(null);
    mockUserRepo.findById.mockResolvedValue({ role: 'client' }); // Not a studio owner
    await expect(useCase.execute({ ownerId: 'owner_456' })).rejects.toThrow(AppError);
  });
});
