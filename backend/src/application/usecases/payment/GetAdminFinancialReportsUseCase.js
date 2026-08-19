'use strict';

/**
 * GetAdminFinancialReportsUseCase — Application Use Case
 *
 * Computes real-time financial KPIs for studio executives including total revenue collected,
 * total outstanding receivables, advance escrow collections, refund volume, and recent invoices.
 */
class GetAdminFinancialReportsUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ studioId = null }) {
    const stats = await this.paymentRepository.getAdminFinancialStats(studioId);

    // Get recent invoices for executive ledger view
    const recentResult = await this.paymentRepository.findAll({
      studioId,
      page: 1,
      limit: 15,
    });

    return {
      financialKpis: {
        totalRevenueCollected: stats.totalRevenueCollected || 0,
        totalOutstandingReceivables: stats.totalOutstandingReceivables || 0,
        totalPackageVolume: stats.totalPackageVolume || 0,
        totalInvoicesCount: stats.totalInvoicesCount || 0,
        paidInvoicesCount: stats.paidInvoicesCount || 0,
        advancePaidCount: stats.advancePaidCount || 0,
        overdueCount: stats.overdueCount || 0,
        refundedCount: stats.refundedCount || 0,
      },
      recentLedger: recentResult.items.map((inv) => inv.generateInvoiceManifest()),
      pagination: recentResult.pagination,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = GetAdminFinancialReportsUseCase;
