'use strict';

const adminActivityLogger = require('../../../infrastructure/admin/AdminActivityLogger');

/**
 * GetActivityLogsUseCase — Super Admin: paginated admin action audit trail
 */
class GetActivityLogsUseCase {
  async execute({ type, search, page = 1, limit = 30 } = {}) {
    let logs = adminActivityLogger.getLogs();

    // Filter by action type
    if (type && type !== 'all') {
      logs = logs.filter((l) => l.type === type);
    }
    // Filter by search (actor email or action text)
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      logs = logs.filter(
        (l) =>
          l.actor.toLowerCase().includes(term) ||
          l.action.toLowerCase().includes(term) ||
          (l.target || '').toLowerCase().includes(term)
      );
    }

    const total = logs.length;
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 100);
    const skip = (pageNum - 1) * limitNum;
    const paginated = logs.slice(skip, skip + limitNum);

    return {
      logs: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }
}

module.exports = GetActivityLogsUseCase;
