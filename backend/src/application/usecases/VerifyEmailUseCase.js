'use strict';

const User = require('../../domain/entities/User');
const AppError = require('../errors/AppError');

/**
 * VerifyEmailUseCase
 *
 *  1. Hash the raw token from the verification link
 *  2. Find user by hashed verification token
 *  3. Check token expiry
 *  4. Mark email as verified via domain method
 *  5. Persist and send welcome email
 */
class VerifyEmailUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   * @param {import('../../infrastructure/services/EmailService')} emailService
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  /**
   * @param {import('../dtos/AuthDTOs').VerifyEmailDTO} dto
   * @returns {Promise<{ message: string }>}
   */
  async execute(dto) {
    // 1. Hash raw token
    const hashedToken = User.hashToken(dto.token);

    // 2. Find user
    const user = await this.userRepository.findByVerificationToken(hashedToken);
    if (!user) {
      throw new AppError(
        'Email verification link is invalid or has already been used.',
        400,
        'INVALID_VERIFICATION_TOKEN'
      );
    }

    // 3. Already verified?
    if (user.isEmailVerified()) {
      throw new AppError('Email address is already verified.', 409, 'EMAIL_ALREADY_VERIFIED');
    }

    // 4. Check expiry
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      throw new AppError(
        'Verification link has expired. Please request a new one.',
        400,
        'INVALID_VERIFICATION_TOKEN'
      );
    }

    // 5. Mark verified (clears token fields, sets status active)
    user.markEmailVerified();
    await this.userRepository.update(user);

    // 6. Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(user);
    } catch (emailErr) {
      console.error('⚠️  Welcome email failed to send:', emailErr.message);
    }

    return { message: 'Email verified successfully. Your account is now active.' };
  }
}

module.exports = VerifyEmailUseCase;
