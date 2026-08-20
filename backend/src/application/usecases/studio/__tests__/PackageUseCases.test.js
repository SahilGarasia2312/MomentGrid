'use strict';

const {
  ListPackagesUseCase,
  CreatePackageUseCase,
  UpdatePackageUseCase,
  DeletePackageUseCase,
} = require('../PackageUseCases');
const AppError = require('../../../errors/AppError');

jest.mock('../../../../domain/entities/Package', () => {
  return class Package {
    constructor(props) {
      Object.assign(this, props);
      this.id = 'pkg_new';
    }
  };
});

describe('PackageUseCases', () => {
  let mockRepo;
  let mockPackage;

  beforeEach(() => {
    mockPackage = {
      id: 'pkg_1',
      studioId: 'studio_1',
      title: 'Standard',
      price: 100,
    };

    mockRepo = {
      findByStudioId: jest.fn().mockResolvedValue([mockPackage]),
      save: jest.fn().mockImplementation(async (p) => p),
      findById: jest.fn().mockResolvedValue(mockPackage),
      update: jest.fn().mockImplementation(async (p) => p),
      delete: jest.fn().mockResolvedValue(),
    };
  });

  describe('ListPackagesUseCase', () => {
    it('should list packages for a studio', async () => {
      const useCase = new ListPackagesUseCase(mockRepo);
      const result = await useCase.execute({ studioId: 'studio_1' });
      expect(mockRepo.findByStudioId).toHaveBeenCalledWith('studio_1');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Standard');
    });
  });

  describe('CreatePackageUseCase', () => {
    it('should create a new package', async () => {
      const useCase = new CreatePackageUseCase(mockRepo);
      const result = await useCase.execute({
        studioId: 'studio_1',
        title: 'Premium',
        price: 500,
      });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result.title).toBe('Premium');
      expect(result.price).toBe(500);
      expect(result.isActive).toBe(true);
    });
  });

  describe('UpdatePackageUseCase', () => {
    it('should throw AppError if package not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new UpdatePackageUseCase(mockRepo);
      await expect(useCase.execute({ packageId: 'none', studioId: 'studio_1' })).rejects.toThrow(AppError);
    });

    it('should throw AppError if package belongs to different studio', async () => {
      const useCase = new UpdatePackageUseCase(mockRepo);
      await expect(useCase.execute({ packageId: 'pkg_1', studioId: 'studio_2' })).rejects.toThrow(AppError);
    });

    it('should update package successfully', async () => {
      const useCase = new UpdatePackageUseCase(mockRepo);
      const result = await useCase.execute({
        packageId: 'pkg_1',
        studioId: 'studio_1',
        title: 'Updated Title',
        price: 200,
      });
      expect(mockRepo.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
      expect(result.price).toBe(200);
    });
  });

  describe('DeletePackageUseCase', () => {
    it('should throw AppError if package not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const useCase = new DeletePackageUseCase(mockRepo);
      await expect(useCase.execute({ packageId: 'none', studioId: 'studio_1' })).rejects.toThrow(AppError);
    });

    it('should delete package successfully', async () => {
      const useCase = new DeletePackageUseCase(mockRepo);
      const result = await useCase.execute({ packageId: 'pkg_1', studioId: 'studio_1' });
      expect(mockRepo.delete).toHaveBeenCalledWith('pkg_1');
      expect(result.success).toBe(true);
    });
  });
});
