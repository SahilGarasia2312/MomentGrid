'use strict';

const AppError = require('../../errors/AppError');
const Package = require('../../../domain/entities/Package');

class ListPackagesUseCase {
  constructor(packageRepository) {
    this.packageRepository = packageRepository;
  }

  async execute({ studioId }) {
    return await this.packageRepository.findByStudioId(studioId);
  }
}

class CreatePackageUseCase {
  constructor(packageRepository) {
    this.packageRepository = packageRepository;
  }

  async execute({ studioId, title, description, price, durationMinutes, deliverablesCount, isActive }) {
    const pkg = new Package({
      studioId,
      title,
      description,
      price,
      durationMinutes,
      deliverablesCount,
      isActive: isActive ?? true,
    });
    return await this.packageRepository.save(pkg);
  }
}

class UpdatePackageUseCase {
  constructor(packageRepository) {
    this.packageRepository = packageRepository;
  }

  async execute({ packageId, studioId, title, description, price, durationMinutes, deliverablesCount, isActive }) {
    const pkg = await this.packageRepository.findById(packageId);
    if (!pkg || pkg.studioId !== studioId) {
      throw new AppError('Package not found in this studio.', 404, 'PACKAGE_NOT_FOUND');
    }

    if (title !== undefined) pkg.title = title;
    if (description !== undefined) pkg.description = description;
    if (price !== undefined) pkg.price = Number(price);
    if (durationMinutes !== undefined) pkg.durationMinutes = Number(durationMinutes);
    if (deliverablesCount !== undefined) pkg.deliverablesCount = Number(deliverablesCount);
    if (isActive !== undefined) pkg.isActive = Boolean(isActive);

    return await this.packageRepository.update(pkg);
  }
}

class DeletePackageUseCase {
  constructor(packageRepository) {
    this.packageRepository = packageRepository;
  }

  async execute({ packageId, studioId }) {
    const pkg = await this.packageRepository.findById(packageId);
    if (!pkg || pkg.studioId !== studioId) {
      throw new AppError('Package not found in this studio.', 404, 'PACKAGE_NOT_FOUND');
    }

    await this.packageRepository.delete(packageId);
    return { success: true, message: 'Package deleted successfully.' };
  }
}

module.exports = {
  ListPackagesUseCase,
  CreatePackageUseCase,
  UpdatePackageUseCase,
  DeletePackageUseCase,
};
