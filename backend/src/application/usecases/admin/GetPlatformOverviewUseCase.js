'use strict';

const UserModel = require('../../../infrastructure/database/models/UserModel');
const StudioModel = require('../../../infrastructure/database/models/StudioModel');
const PhotographerModel = require('../../../infrastructure/database/models/PhotographerModel');
const PaymentModel = require('../../../infrastructure/database/models/PaymentModel');
const EventModel = require('../../../infrastructure/database/models/EventModel');
const GalleryModel = require('../../../infrastructure/database/models/GalleryModel');

/**
 * GetPlatformOverviewUseCase — Super Admin Command Centre
 *
 * Aggregates platform-wide KPIs in a single concurrent Promise.all() call
 * across all existing Mongoose models. No new schemas required.
 */
class GetPlatformOverviewUseCase {
  async execute() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalStudios,
      totalPhotographers,
      totalClients,
      totalBookings,
      totalGalleries,
      activeUsers,
      suspendedUsers,
      revenueAgg,
      recentSignups,
      recentPayments,
      weeklySignups,
    ] = await Promise.all([
      UserModel.countDocuments(),
      StudioModel.countDocuments(),
      PhotographerModel.countDocuments(),
      UserModel.countDocuments({ role: 'client' }),
      EventModel.countDocuments(),
      GalleryModel.countDocuments(),
      UserModel.countDocuments({ status: 'active' }),
      UserModel.countDocuments({ status: 'suspended' }),

      // Revenue aggregation
      PaymentModel.aggregate([
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$amountPaid' },
            totalOutstanding: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['pending', 'advance_paid', 'overdue']] },
                  { $subtract: ['$amount', '$amountPaid'] },
                  0,
                ],
              },
            },
            totalInvoices: { $sum: 1 },
          },
        },
      ]),

      // Recent signups (last 10)
      UserModel.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('fullName email role status createdAt')
        .lean(),

      // Recent payments (last 5)
      PaymentModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('invoiceNumber clientEmail amount amountPaid status currency createdAt')
        .lean(),

      // Signups per day over last 7 days
      UserModel.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const revData = revenueAgg[0] || { totalCollected: 0, totalOutstanding: 0, totalInvoices: 0 };

    return {
      kpis: {
        totalUsers,
        totalStudios,
        totalPhotographers,
        totalClients,
        totalBookings,
        totalGalleries,
        activeUsers,
        suspendedUsers,
        totalRevenue: revData.totalCollected,
        totalOutstanding: revData.totalOutstanding,
        totalInvoices: revData.totalInvoices,
      },
      recentSignups: recentSignups.map((u) => ({
        id: u._id.toString(),
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
      recentPayments: recentPayments.map((p) => ({
        id: p._id.toString(),
        invoiceNumber: p.invoiceNumber,
        clientEmail: p.clientEmail,
        amount: p.amount,
        amountPaid: p.amountPaid,
        status: p.status,
        currency: p.currency,
        createdAt: p.createdAt,
      })),
      weeklySignups,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = GetPlatformOverviewUseCase;
