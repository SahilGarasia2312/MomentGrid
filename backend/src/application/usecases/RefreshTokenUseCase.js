'use strict';

const AppError = require('../errors/AppError');
const { AuthResponseDTO } = require('../dtos/AuthDTOs');

/**
 * RefreshTokenUseCase
 *
 *  1. Verify refresh JWT signature
 *  2. Check token is not blacklisted
 *  3. Find user and confirm active
 *  4. Blacklist used refresh token (rotation)
 *  5. Issue new access + refresh tokens
 */
class RefreshTokenUseCase {
  /**
   * @param {import('../../domain/repositories/IUserRepository')} userRepository
   * @param {import('../../infrastructure/services/JwtService')} jwtService
   * @param {import('../../infrastructure/services/TokenBlacklist')} tokenBlacklist
   */
  constructor(userRepository, jwtService, tokenBlacklist) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.tokenBlacklist = tokenBlacklist;
  }

  /**
   * @param {import('../dtos/AuthDTOs').RefreshTokenDTO} dto
   * @returns {Promise<import('../dtos/AuthDTOs').AuthResponseDTO>}
   */
  async execute(dto) {
    const { refreshToken } = dto;

    if (!refreshToken) {
      throw new AppError('Refresh token is required.', 401, 'REFRESH_TOKEN_INVALID');
    }

    // 1. Verify signature
    let payload;
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        'Refresh token is invalid or expired. Please log in again.',
        401,
        'REFRESH_TOKEN_INVALID'
      );
    }

    // 2. Check blacklist
    if (this.tokenBlacklist.has(refreshToken)) {
      throw new AppError(
        'Refresh token has been revoked. Please log in again.',
        401,
        'REFRESH_TOKEN_INVALID'
      );
    }

    // 3. Find user
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.canLogin()) {
      throw new AppError('User account not found or suspended.', 401, 'REFRESH_TOKEN_INVALID');
    }

    // 4. Blacklist old refresh token (rotation — prevents reuse)
    this.tokenBlacklist.add(refreshToken);

    // 5. Issue new tokens
    const tokenPayload = {
      sub: user.id,
      role: user.role,
      emailVerified: user.emailVerified,
      studioId: user.studioId,
    };

    const newAccessToken = this.jwtService.signAccessToken(tokenPayload);
    const newRefreshToken = this.jwtService.signRefreshToken({ sub: user.id });

    return new AuthResponseDTO({
      user: user.toPublic(),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
}

module.exports = RefreshTokenUseCase;
