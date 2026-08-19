'use strict';

const AppError = require('../../errors/AppError');
const Staff = require('../../../domain/entities/Staff');

class AddStaffUseCase {
  constructor(staffRepository, userRepository) {
    this.staffRepository = staffRepository;
    this.userRepository = userRepository;
  }

  async execute({ studioId, fullName, email, role, phone }) {
    const existingStaff = await this.staffRepository.findByEmailAndStudio(email, studioId);
    if (existingStaff) {
      throw new AppError('That staff member is already assigned to this studio.', 409, 'DUPLICATE_STAFF');
    }

    // Check if user account already exists in system to link userId
    const existingUser = await this.userRepository.findByEmail(email);
    let userId = null;
    let status = 'invited';
    if (existingUser) {
      userId = existingUser.id;
      status = 'active';
      // If user has no studioId assigned yet, link them to this studio
      if (!existingUser.studioId && existingUser.role === 'photographer') {
        existingUser.studioId = studioId;
        await this.userRepository.update(existingUser);
      }
    }

    const staff = new Staff({
      studioId,
      userId,
      fullName,
      email,
      role: role || Staff.ROLES.LEAD_PHOTOGRAPHER,
      status,
      phone,
    });

    return await this.staffRepository.save(staff);
  }
}

module.exports = AddStaffUseCase;
