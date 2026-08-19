'use strict';

/**
 * IStaffRepository — Abstract Repository Interface
 */
class IStaffRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IStaffRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStudioId(studioId) {
    throw new Error('IStaffRepository.findByStudioId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByEmailAndStudio(email, studioId) {
    throw new Error('IStaffRepository.findByEmailAndStudio() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(staff) {
    throw new Error('IStaffRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(staff) {
    throw new Error('IStaffRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IStaffRepository.delete() must be implemented.');
  }
}

module.exports = IStaffRepository;
