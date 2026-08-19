'use strict';

const UserModel = require('../../../infrastructure/database/models/UserModel');
const AppError = require('../../errors/AppError');

/**
 * GetAllUsersUseCase — Super Admin paginated user listing with filters
 */
class GetAllUsersUseCase {
  async execute({ role, status, search, page = 1, limit = 20 } = {}) {
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-passwordHash -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires')
        .lean(),
      UserModel.countDocuments(query),
    ]);

    return {
      users: users.map((u) => ({
        id: u._id.toString(),
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
        emailVerified: u.emailVerified,
        phone: u.phone || null,
        studioId: u.studioId ? u.studioId.toString() : null,
        lastLoginAt: u.lastLoginAt || null,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }
}

module.exports = GetAllUsersUseCase;
