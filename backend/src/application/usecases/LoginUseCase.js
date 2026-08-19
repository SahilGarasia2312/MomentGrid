'use strict';

const bcrypt = require('bcryptjs');
const AppError = require('../errors/AppError');
const { AuthResponseDTO } = require('../dtos/AuthDTOs');

/**
 * LoginUseCase
 *
 * Orchestrates user login:
 *  1. Find user by email
 *  2. Verify password (constant-time compare)
 *  3. Check account status (active, not suspended)
 *  4. Check email verified
 *  5. Record login timestamp
 *  6. Issue access + refresh tokens
 */
class LoginUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   * @param {import('../../infrastructure/services/JwtService')} jwtService
   */
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  /**
   * @param {import('../dtos/AuthDTOs').LoginDTO} dto
   * @returns {Promise<import('../dtos/AuthDTOs').AuthResponseDTO>}
   */
  async execute(dto) {
    // 1. Find user (always use same generic error to prevent email enumeration)
    const user = await this.userRepository.findByEmail(dto.email);

    // 2. Verify password — run bcrypt even if user not found to prevent timing attacks
    const dummyHash = '$2a$12$dummyhashfortimingattackprevention.dummydummydummydummydu';
    const passwordMatch = await bcrypt.compare(
      dto.password,
      user ? user.passwordHash : dummyHash
    );

    if (!user || !passwordMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // 3. Check account status
    if (user.isSuspended()) {
      throw new AppError(
        'Your account has been suspended. Please contact support.',
        403,
        'ACCOUNT_SUSPENDED'
      );
    }

    // 4. Check email verification
    if (!user.isEmailVerified()) {
      throw new AppError(
        'Please verify your email address before logging in.',
        403,
        'EMAIL_NOT_VERIFIED'
      );
    }

    // 5. Record login
    user.recordLogin();
    await this.userRepository.update(user);

    // 6. Issue tokens
    const tokenPayload = {
      sub: user.id,
      role: user.role,
      emailVerified: user.emailVerified,
      studioId: user.studioId,
    };

    const accessToken = this.jwtService.signAccessToken(tokenPayload);
    const refreshToken = this.jwtService.signRefreshToken(
      { sub: user.id },
      dto.rememberMe ? '30d' : undefined
    );

    return new AuthResponseDTO({
      user: user.toPublic(),
      accessToken,
      refreshToken,
    });
  }
}

module.exports = LoginUseCase;
