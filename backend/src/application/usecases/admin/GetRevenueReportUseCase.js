'use strict';

const PaymentModel = require('../../../infrastructure/database/models/PaymentModel');
const StudioModel = require('../../../infrastructure/database/models/StudioModel');

/**
 * GetRevenueReportUseCase — Super Admin: platform-wide financial report
 *
 * Produces: total collected, outstanding, refunded, monthly MRR array,
 * top 5 studios by revenue, payment status breakdown.
 */
class GetRevenueReportUseCase {
  async execute() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [globalAgg, statusBreakdown, monthlyMRR, topStudios] = await Promise.all([
      // Global financial KPIs
      PaymentModel.aggregate([
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$amountPaid' },
            totalContractVolume: { $sum: '$amount' },
            totalRefunded: {
              $sum: {
                $cond: [{ $eq: ['$status', 'refunded'] }, '$amountPaid', 0],
              },
            },
            totalInvoices: { $sum: 1 },
            avgInvoiceValue: { $avg: '$amount' },
          },
        },
      ]),

      // Status breakdown for donut chart
      PaymentModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amountPaid' } } },
        { $sort: { total: -1 } },
      ]),

      // Monthly revenue (MRR) over last 12 months
      PaymentModel.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo }, amountPaid: { $gt: 0 } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$amountPaid' },
            invoiceCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),

      // Top 5 studios by total revenue collected
      PaymentModel.aggregate([
        { $match: { studioId: { $ne: null } } },
        { $group: { _id: '$studioId', totalCollected: { $sum: '$amountPaid' }, invoiceCount: { $sum: 1 } } },
        { $sort: { totalCollected: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Resolve studio names for top studios
    const studioIds = topStudios.map((s) => s._id).filter(Boolean);
    const studioNames = await StudioModel.find({ _id: { $in: studioIds } }).select('name slug').lean();
    const studioMap = {};
    studioNames.forEach((s) => { studioMap[s._id.toString()] = s.name; });

    const globalData = globalAgg[0] || {
      totalCollected: 0,
      totalContractVolume: 0,
      totalRefunded: 0,
      totalInvoices: 0,
      avgInvoiceValue: 0,
    };

    return {
      kpis: {
        totalCollected: globalData.totalCollected,
        totalContractVolume: globalData.totalContractVolume,
        totalOutstanding: Math.max(0, globalData.totalContractVolume - globalData.totalCollected),
        totalRefunded: globalData.totalRefunded,
        totalInvoices: globalData.totalInvoices,
        avgInvoiceValue: Math.round(globalData.avgInvoiceValue || 0),
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
        total: s.total,
      })),
      monthlyMRR: monthlyMRR.map((m) => ({
        month: m._id,
        revenue: m.revenue,
        invoiceCount: m.invoiceCount,
      })),
      topStudios: topStudios.map((s) => ({
        studioId: s._id ? s._id.toString() : null,
        studioName: s._id ? (studioMap[s._id.toString()] || 'Unknown Studio') : 'Unassigned',
        totalCollected: s.totalCollected,
        invoiceCount: s.invoiceCount,
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = GetRevenueReportUseCase;
