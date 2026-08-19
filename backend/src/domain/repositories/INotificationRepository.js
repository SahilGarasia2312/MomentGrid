'use strict';

/**
 * INotificationRepository — Abstract Repository Interface for Notification persistence
 */
class INotificationRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('INotificationRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByRecipientEmail(email, { isRead, type, page, limit }) {
    throw new Error('INotificationRepository.findByRecipientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async getUnreadCount(email) {
    throw new Error('INotificationRepository.getUnreadCount() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async markAsRead({ notificationIds, recipientEmail, markAll }) {
    throw new Error('INotificationRepository.markAsRead() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(notification) {
    throw new Error('INotificationRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async deleteById(id) {
    throw new Error('INotificationRepository.deleteById() must be implemented.');
  }
}

module.exports = INotificationRepository;
