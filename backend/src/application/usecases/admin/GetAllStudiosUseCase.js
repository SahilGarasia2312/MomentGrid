'use strict';

const StudioModel = require('../../../infrastructure/database/models/StudioModel');
const PhotographerModel = require('../../../infrastructure/database/models/PhotographerModel');
const PaymentModel = require('../../../infrastructure/database/models/PaymentModel');

/**
 * GetAllStudiosUseCase — Super Admin: paginated studio directory with metrics
 */
class GetAllStudiosUseCase {
  async execute({ search, page = 1, limit = 20 } = {}) {
    const query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { slug: regex }, { contactEmail: regex }];
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);

    const [studios, total] = await Promise.all([
      StudioModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      StudioModel.countDocuments(query),
    ]);

    // Enrich each studio with photographer count and revenue (concurrent)
    const enriched = await Promise.all(
      studios.map(async (studio) => {
        const studioId = studio._id;
        const [photographerCount, revenueAgg] = await Promise.all([
          PhotographerModel.countDocuments({ studioId }),
          PaymentModel.aggregate([
            { $match: { studioId } },
            { $group: { _id: null, totalCollected: { $sum: '$amountPaid' } } },
          ]),
        ]);

        return {
          id: studioId.toString(),
          name: studio.name,
          slug: studio.slug,
          ownerId: studio.ownerId ? studio.ownerId.toString() : null,
          logoUrl: studio.logoUrl,
          contactEmail: studio.contactEmail,
          phone: studio.phone,
          about: studio.about,
          brandColor: studio.brandColor,
          photographerCount,
          totalRevenue: revenueAgg[0]?.totalCollected || 0,
          createdAt: studio.createdAt,
        };
      })
    );

    return {
      studios: enriched,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }
}

module.exports = GetAllStudiosUseCase;
