'use strict';

/**
 * IPackageRepository — Abstract Repository Interface
 */
class IPackageRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IPackageRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStudioId(studioId) {
    throw new Error('IPackageRepository.findByStudioId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(pkg) {
    throw new Error('IPackageRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(pkg) {
    throw new Error('IPackageRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IPackageRepository.delete() must be implemented.');
  }
}

module.exports = IPackageRepository;
