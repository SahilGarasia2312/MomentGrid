'use strict';

/**
 * LogoutUseCase
 *
 *  1. Blacklist the current refresh token
 *  (The access token expires naturally — stateless JWT design)
 */
class LogoutUseCase {
  /**
   * @param {import('../../infrastructure/services/TokenBlacklist')} tokenBlacklist
   */
  constructor(tokenBlacklist) {
    this.tokenBlacklist = tokenBlacklist;
  }

  /**
   * @param {import('../dtos/AuthDTOs').LogoutDTO} dto
   * @returns {Promise<void>}
   */
  async execute(dto) {
    if (dto.refreshToken) {
      this.tokenBlacklist.add(dto.refreshToken);
    }
    // No error thrown even if token is missing — idempotent logout
  }
}

module.exports = LogoutUseCase;
