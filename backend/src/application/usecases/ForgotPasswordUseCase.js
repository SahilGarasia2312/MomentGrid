'use strict';

/**
 * ForgotPasswordUseCase
 *
 * Handles password reset requests:
 *  1. Attempt to find user by email
 *  2. If found: generate reset token and send email
 *  3. Always return success (prevents email enumeration)
 */
class ForgotPasswordUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   * @param {import('../../infrastructure/services/EmailService')} emailService
   */
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  /**
   * @param {import('../dtos/AuthDTOs').ForgotPasswordDTO} dto
   * @returns {Promise<void>}
   */
  async execute(dto) {
    const user = await this.userRepository.findByEmail(dto.email);

    // Always return same message — prevents revealing whether email is registered
    if (!user) return;

    // Generate token (mutates user entity, stores hash internally)
    const rawToken = user.generatePasswordResetToken();

    // Persist the hashed token + expiry
    await this.userRepository.update(user);

    // Send email (non-blocking)
    try {
      await this.emailService.sendPasswordResetEmail(user, rawToken);
    } catch (emailErr) {
      console.error('⚠️  Password reset email failed to send:', emailErr.message);
    }
  }
}

module.exports = ForgotPasswordUseCase;
