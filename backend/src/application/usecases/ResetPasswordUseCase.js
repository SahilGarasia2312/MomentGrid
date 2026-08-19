'use strict';

const bcrypt = require('bcryptjs');
const User = require('../../domain/entities/User');
const AppError = require('../errors/AppError');

/**
 * ResetPasswordUseCase
 *
 *  1. Hash the raw token from email link
 *  2. Find user by hashed token
 *  3. Validate token expiry
 *  4. Hash new password
 *  5. Update user entity (clears token via domain method)
 *  6. Persist
 */
class ResetPasswordUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @param {import('../dtos/AuthDTOs').ResetPasswordDTO} dto
   * @returns {Promise<void>}
   */
  async execute(dto) {
    // 1. Hash raw token → lookup key
    const hashedToken = User.hashToken(dto.token);

    // 2. Find user
    const user = await this.userRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new AppError(
        'Password reset link is invalid or has expired.',
        400,
        'INVALID_RESET_TOKEN'
      );
    }

    // 3. Check expiry
    if (!user.isResetTokenValid()) {
      throw new AppError(
        'Password reset link has expired. Please request a new one.',
        400,
        'INVALID_RESET_TOKEN'
      );
    }

    // 4. Hash new password
    const newPasswordHash = await bcrypt.hash(dto.password, 12);

    // 5. Reset via domain method (clears token fields)
    user.resetPassword(newPasswordHash);

    // 6. Persist
    await this.userRepository.update(user);
  }
}

module.exports = ResetPasswordUseCase;
