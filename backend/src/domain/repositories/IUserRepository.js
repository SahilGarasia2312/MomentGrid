'use strict';

/**
 * IUserRepository — Abstract Repository Interface
 *
 * Defines the contract that any persistence layer must satisfy.
 * The application layer depends on this interface, NOT on Mongoose/SQL/etc.
 * Concrete implementations live in infrastructure/database/repositories/.
 */
class IUserRepository {
  /**
   * Find a user by their unique ID.
   * @param {string} id
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IUserRepository.findById() must be implemented.');
  }

  /**
   * Find a user by their email address (case-insensitive).
   * @param {string} email
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findByEmail(email) {
    throw new Error('IUserRepository.findByEmail() must be implemented.');
  }

  /**
   * Find a user by their hashed password reset token.
   * @param {string} hashedToken
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findByResetToken(hashedToken) {
    throw new Error('IUserRepository.findByResetToken() must be implemented.');
  }

  /**
   * Find a user by their hashed email verification token.
   * @param {string} hashedToken
   * @returns {Promise<import('../entities/User')|null>}
   */
  // eslint-disable-next-line no-unused-vars
  async findByVerificationToken(hashedToken) {
    throw new Error('IUserRepository.findByVerificationToken() must be implemented.');
  }

  /**
   * Persist a new User entity to storage.
   * @param {import('../entities/User')} user
   * @returns {Promise<import('../entities/User')>} the saved user with generated id
   */
  // eslint-disable-next-line no-unused-vars
  async save(user) {
    throw new Error('IUserRepository.save() must be implemented.');
  }

  /**
   * Persist changes to an existing User entity.
   * @param {import('../entities/User')} user
   * @returns {Promise<import('../entities/User')>}
   */
  // eslint-disable-next-line no-unused-vars
  async update(user) {
    throw new Error('IUserRepository.update() must be implemented.');
  }

  /**
   * Soft-delete a user by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IUserRepository.delete() must be implemented.');
  }
}

module.exports = IUserRepository;
