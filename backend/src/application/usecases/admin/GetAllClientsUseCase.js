'use strict';

const UserModel = require('../../../infrastructure/database/models/UserModel');
const PaymentModel = require('../../../infrastructure/database/models/PaymentModel');
const EventModel = require('../../../infrastructure/database/models/EventModel');

/**
 * GetAllClientsUseCase — Super Admin: paginated client list with booking + payment summaries
 */
class GetAllClientsUseCase {
  async execute({ search, status, page = 1, limit = 20 } = {}) {
    const query = { role: 'client' };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);

    const [clients, total] = await Promise.all([
      UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-passwordHash -emailVerificationToken -resetPasswordToken')
        .lean(),
      UserModel.countDocuments(query),
    ]);

    // Enrich each client with bookings count and total paid
    const enriched = await Promise.all(
      clients.map(async (client) => {
        const email = client.email;
        const [bookingCount, paymentAgg] = await Promise.all([
          EventModel.countDocuments({ clientEmail: email }),
          PaymentModel.aggregate([
            { $match: { clientEmail: email } },
            { $group: { _id: null, totalPaid: { $sum: '$amountPaid' }, invoiceCount: { $sum: 1 } } },
          ]),
        ]);

        const payData = paymentAgg[0] || { totalPaid: 0, invoiceCount: 0 };
        return {
          id: client._id.toString(),
          fullName: client.fullName,
          email: client.email,
          status: client.status,
          phone: client.phone || null,
          emailVerified: client.emailVerified,
          lastLoginAt: client.lastLoginAt || null,
          bookingCount,
          totalPaid: payData.totalPaid,
          invoiceCount: payData.invoiceCount,
          createdAt: client.createdAt,
        };
      })
    );

    return {
      clients: enriched,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }
}

module.exports = GetAllClientsUseCase;
