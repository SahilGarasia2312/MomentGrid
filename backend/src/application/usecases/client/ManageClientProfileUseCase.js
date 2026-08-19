'use strict';

const AppError = require('../../errors/AppError');

class ManageClientProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getProfile({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to get profile.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    const user = await this.userRepository.findByEmail(clientEmail.toLowerCase().trim());
    if (!user) {
      // Return a virtual profile structure if user object is virtual
      return {
        email: clientEmail,
        fullName: clientEmail.split('@')[0],
        phone: null,
        notificationPreferences: { email: true, sms: true, push: false },
        shippingAddress: { street: '', city: '', state: '', zip: '', country: 'US' },
      };
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      notificationPreferences: user.notificationPreferences || { email: true, sms: true, push: false },
      shippingAddress: user.shippingAddress || { street: '', city: '', state: '', zip: '', country: 'US' },
    };
  }

  async updateProfile({ clientEmail, fullName, phone, notificationPreferences, shippingAddress }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to update profile.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    const user = await this.userRepository.findByEmail(clientEmail.toLowerCase().trim());
    if (!user) {
      throw new AppError('User account not found.', 404, 'USER_NOT_FOUND');
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (notificationPreferences !== undefined) user.notificationPreferences = notificationPreferences;
    if (shippingAddress !== undefined) user.shippingAddress = shippingAddress;

    const updated = await this.userRepository.update(user);
    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      phone: updated.phone,
      role: updated.role,
      status: updated.status,
      notificationPreferences: updated.notificationPreferences || { email: true, sms: true, push: false },
      shippingAddress: updated.shippingAddress || { street: '', city: '', state: '', zip: '', country: 'US' },
    };
  }
}

module.exports = ManageClientProfileUseCase;
