'use strict';

const bcrypt = require('bcryptjs');
const User = require('../../domain/entities/User');
const AppError = require('../errors/AppError');
const { AuthResponseDTO } = require('../dtos/AuthDTOs');

/**
 * RegisterUseCase
 *
 * Orchestrates new user registration:
 *  1. Check email uniqueness
 *  2. Hash password
 *  3. Build User entity
 *  4. Persist user
 *  5. Generate & store email verification token
 *  6. Send verification email
 *  7. Issue access + refresh tokens
 */
class RegisterUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   * @param {import('../../infrastructure/services/JwtService')} jwtService
   * @param {import('../../infrastructure/services/EmailService')} emailService
   */
  constructor(userRepository, jwtService, emailService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.emailService = emailService;
  }

  /**
   * @param {import('../dtos/AuthDTOs').RegisterDTO} dto
   * @returns {Promise<import('../dtos/AuthDTOs').AuthResponseDTO>}
   */
  async execute(dto) {
    // 1. Check email uniqueness
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new AppError('An account with this email already exists.', 409, 'DUPLICATE_EMAIL');
    }

    // 2. Hash password (cost factor 12)
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 3. Build domain entity
    const user = new User({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role,
      phone: dto.phone,
      emailVerified: false,
      status: User.STATUSES.PENDING,
    });

    // 4. Generate verification token (mutates user, stores hash)
    const rawVerificationToken = user.generateEmailVerificationToken();

    // 5. Persist
    const savedUser = await this.userRepository.save(user);

    // 6. Send verification email (non-blocking — failure logged, not thrown)
    try {
      await this.emailService.sendVerificationEmail(savedUser, rawVerificationToken);
    } catch (emailErr) {
      console.error('⚠️  Verification email failed to send:', emailErr.message);
    }

    // 7. Issue tokens
    const tokenPayload = {
      sub: savedUser.id,
      role: savedUser.role,
      emailVerified: savedUser.emailVerified,
    };
    const accessToken = this.jwtService.signAccessToken(tokenPayload);
    const refreshToken = this.jwtService.signRefreshToken({ sub: savedUser.id });

    return new AuthResponseDTO({
      user: savedUser.toPublic(),
      accessToken,
      refreshToken,
    });
  }
}

module.exports = RegisterUseCase;
