'use strict';

const UserModel = require('../../../infrastructure/database/models/UserModel');
const AppError = require('../../errors/AppError');
const adminActivityLogger = require('../../../infrastructure/admin/AdminActivityLogger');

/**
 * UpdateUserStatusUseCase — Super Admin: suspend / activate / change role
 */
class UpdateUserStatusUseCase {
  async execute({ userId, status, role, actorEmail = 'superadmin@momentgrid.com' }) {
    if (!userId) {
      throw new AppError('User ID is required.', 400, 'USER_ID_REQUIRED');
    }
    if (!status && !role) {
      throw new AppError('Either status or role must be provided.', 400, 'NO_UPDATE_FIELDS');
    }

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    const updateFields = { updatedAt: new Date() };
    if (status) {
      const validStatuses = ['active', 'suspended', 'pending_verification'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, 'INVALID_STATUS');
      }
      updateFields.status = status;
    }
    if (role) {
      const validRoles = ['admin', 'studio_owner', 'photographer', 'client'];
      if (!validRoles.includes(role)) {
        throw new AppError(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400, 'INVALID_ROLE');
      }
      updateFields.role = role;
    }

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select('-passwordHash -emailVerificationToken -resetPasswordToken').lean();

    // feature: log admin action to activity trail
    const action = status
      ? `Changed status to "${status}" for user ${user.email}`
      : `Changed role to "${role}" for user ${user.email}`;
    adminActivityLogger.log({ actor: actorEmail, action, target: `User:${user.email}`, type: 'user_update' });

    return {
      id: updated._id.toString(),
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }
}

module.exports = UpdateUserStatusUseCase;
