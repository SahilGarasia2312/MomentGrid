'use strict';

/**
 * IPhotographerRepository — Pure Domain Interface Contract
 */
class IPhotographerRepository {
  async findById(photographerId) {
    throw new Error('Method not implemented: findById');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented: findByUserId');
  }

  async findByStudioId(studioId) {
    throw new Error('Method not implemented: findByStudioId');
  }

  async create(photographerEntity) {
    throw new Error('Method not implemented: create');
  }

  async update(photographerId, updateProps) {
    throw new Error('Method not implemented: update');
  }

  async blockDates(photographerId, blockedDatesArray) {
    throw new Error('Method not implemented: blockDates');
  }
}

module.exports = IPhotographerRepository;
