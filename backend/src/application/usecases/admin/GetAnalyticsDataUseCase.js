'use strict';

const UserModel = require('../../../infrastructure/database/models/UserModel');
const EventModel = require('../../../infrastructure/database/models/EventModel');
const GalleryModel = require('../../../infrastructure/database/models/GalleryModel');
const NotificationModel = require('../../../infrastructure/database/models/NotificationModel');

/**
 * GetAnalyticsDataUseCase — Super Admin: time-series analytics for charts
 *
 * Returns: user growth over 30 days, bookings per month (12m), gallery uploads per week (8w),
 * notification dispatch by type (30d), role distribution.
 */
class GetAnalyticsDataUseCase {
  async execute() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const eightWeeksAgo = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000);

    const [
      userGrowth,
      roleDistribution,
      bookingsByMonth,
      galleryUploads,
      notificationsByType,
      statusDistribution,
    ] = await Promise.all([
      // Daily user registrations over last 30 days
      UserModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Role distribution pie data
      UserModel.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Monthly bookings over last 12 months
      EventModel.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),

      // Weekly gallery uploads over last 8 weeks
      GalleryModel.aggregate([
        { $match: { createdAt: { $gte: eightWeeksAgo } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-W%V',
                date: '$createdAt',
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 8 },
      ]),

      // Notifications dispatched by type over last 30 days
      NotificationModel.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // User account status distribution
      UserModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      userGrowth,
      roleDistribution: roleDistribution.map((r) => ({ role: r._id, count: r.count })),
      bookingsByMonth: bookingsByMonth.map((b) => ({ month: b._id, count: b.count })),
      galleryUploads: galleryUploads.map((g) => ({ week: g._id, count: g.count })),
      notificationsByType: notificationsByType.map((n) => ({ type: n._id, count: n.count })),
      statusDistribution: statusDistribution.map((s) => ({ status: s._id, count: s.count })),
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = GetAnalyticsDataUseCase;
