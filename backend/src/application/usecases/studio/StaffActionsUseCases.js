'use strict';

const AppError = require('../../errors/AppError');

class UpdateStaffRoleUseCase {
  constructor(staffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute({ staffId, studioId, role, status, fullName, phone }) {
    const staff = await this.staffRepository.findById(staffId);
    if (!staff || staff.studioId !== studioId) {
      throw new AppError('Staff member not found in this studio.', 404, 'STAFF_NOT_FOUND');
    }

    if (role !== undefined) staff.role = role;
    if (status !== undefined) staff.status = status;
    if (fullName !== undefined) staff.fullName = fullName;
    if (phone !== undefined) staff.phone = phone;

    return await this.staffRepository.update(staff);
  }
}

class RemoveStaffUseCase {
  constructor(staffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute({ staffId, studioId }) {
    const staff = await this.staffRepository.findById(staffId);
    if (!staff || staff.studioId !== studioId) {
      throw new AppError('Staff member not found in this studio.', 404, 'STAFF_NOT_FOUND');
    }

    await this.staffRepository.delete(staffId);
    return { success: true, message: 'Staff member removed successfully.' };
  }
}

module.exports = {
  UpdateStaffRoleUseCase,
  RemoveStaffUseCase,
};
