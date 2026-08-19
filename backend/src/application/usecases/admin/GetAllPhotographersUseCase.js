'use strict';

const PhotographerModel = require('../../../infrastructure/database/models/PhotographerModel');
const StudioModel = require('../../../infrastructure/database/models/StudioModel');

/**
 * GetAllPhotographersUseCase — Super Admin: paginated photographer roster
 */
class GetAllPhotographersUseCase {
  async execute({ search, studioId, page = 1, limit = 20 } = {}) {
    const query = {};
    if (studioId) {
      query.studioId = studioId;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);

    const [photographers, total] = await Promise.all([
      PhotographerModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      PhotographerModel.countDocuments(query),
    ]);

    // Resolve studio names for each photographer
    const studioIds = [...new Set(photographers.map((p) => p.studioId).filter(Boolean))];
    const studios = await StudioModel.find({ _id: { $in: studioIds } }).select('name slug').lean();
    const studioMap = {};
    studios.forEach((s) => { studioMap[s._id.toString()] = s.name; });

    return {
      photographers: photographers.map((p) => ({
        id: p._id.toString(),
        userId: p.userId ? p.userId.toString() : null,
        studioId: p.studioId ? p.studioId.toString() : null,
        studioName: p.studioId ? (studioMap[p.studioId.toString()] || 'Independent') : 'Independent',
        fullName: p.fullName,
        email: p.email,
        avatarUrl: p.avatarUrl,
        specializations: p.specializations || [],
        yearsExperience: p.yearsExperience || 0,
        stats: p.stats || {},
        createdAt: p.createdAt,
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

module.exports = GetAllPhotographersUseCase;
