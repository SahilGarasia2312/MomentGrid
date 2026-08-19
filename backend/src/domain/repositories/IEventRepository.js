'use strict';

/**
 * IEventRepository — Abstract Repository Interface
 */
class IEventRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IEventRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStudioId(studioId) {
    throw new Error('IEventRepository.findByStudioId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStaffId(staffId) {
    throw new Error('IEventRepository.findByStaffId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(event) {
    throw new Error('IEventRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(event) {
    throw new Error('IEventRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IEventRepository.delete() must be implemented.');
  }
}

module.exports = IEventRepository;
