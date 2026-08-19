'use strict';

/**
 * IReviewRepository — Abstract Repository Interface
 */
class IReviewRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IReviewRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStudioId(studioId, onlyPublic = false) {
    throw new Error('IReviewRepository.findByStudioId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(review) {
    throw new Error('IReviewRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(review) {
    throw new Error('IReviewRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IReviewRepository.delete() must be implemented.');
  }
}

module.exports = IReviewRepository;
