'use strict';

/**
 * AdminActivityLogger — Singleton in-memory audit trail
 *
 * Records all mutating Super Admin actions during the process lifetime.
 * Stores last 500 entries (FIFO). No external dependency required.
 */
class AdminActivityLogger {
  constructor() {
    this._logs = [];
    this._maxEntries = 500;

    // feature: seed initial system log entries for demo visibility
    this._seed();
  }

  /**
   * Log a new admin action.
   * @param {object} entry
   * @param {string} entry.actor     — Admin email who performed the action
   * @param {string} entry.action    — Human-readable description of the action
   * @param {string} entry.target    — Resource affected (e.g., "User:elena@example.com")
   * @param {string} entry.type      — Action type (user_update | studio_update | settings | login | other)
   */
  log({ actor, action, target = '', type = 'other' }) {
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actor: actor || 'superadmin@momentgrid.com',
      action,
      target,
      type,
      timestamp: new Date().toISOString(),
    };

    this._logs.unshift(entry);

    // Prune to max capacity
    if (this._logs.length > this._maxEntries) {
      this._logs = this._logs.slice(0, this._maxEntries);
    }

    return entry;
  }

  /**
   * Get all logs (newest first).
   */
  getLogs() {
    return this._logs;
  }

  /**
   * Seed demo log entries for first-load verification.
   */
  _seed() {
    const seeds = [
      { actor: 'superadmin@momentgrid.com', action: 'Platform settings updated — Maintenance Mode disabled', target: 'Settings:platform', type: 'settings', ts: 5 },
      { actor: 'superadmin@momentgrid.com', action: 'Changed status to "suspended" for user dev@test.com', target: 'User:dev@test.com', type: 'user_update', ts: 12 },
      { actor: 'superadmin@momentgrid.com', action: 'Changed role to "studio_owner" for user alex.kim@momentgrid.com', target: 'User:alex.kim@momentgrid.com', type: 'user_update', ts: 35 },
      { actor: 'superadmin@momentgrid.com', action: 'Accessed Revenue Report — Platform financial KPIs retrieved', target: 'Report:revenue', type: 'report', ts: 60 },
      { actor: 'superadmin@momentgrid.com', action: 'Changed status to "active" for user sofia.garcia@momentgrid.com', target: 'User:sofia.garcia@momentgrid.com', type: 'user_update', ts: 95 },
      { actor: 'superadmin@momentgrid.com', action: 'Platform settings updated — Razorpay mode set to test', target: 'Settings:razorpay', type: 'settings', ts: 180 },
      { actor: 'superadmin@momentgrid.com', action: 'Accessed Analytics Dashboard — Time-series data generated', target: 'Report:analytics', type: 'report', ts: 240 },
      { actor: 'superadmin@momentgrid.com', action: 'Super Admin session started', target: 'System', type: 'login', ts: 360 },
    ];

    seeds.forEach(({ actor, action, target, type, ts }) => {
      this._logs.push({
        id: `log_seed_${ts}`,
        actor,
        action,
        target,
        type,
        timestamp: new Date(Date.now() - ts * 60 * 1000).toISOString(),
      });
    });
  }
}

module.exports = new AdminActivityLogger();
