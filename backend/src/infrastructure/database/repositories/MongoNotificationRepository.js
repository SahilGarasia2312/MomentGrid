'use strict';

const NotificationModel = require('../models/NotificationModel');
const Notification = require('../../../domain/entities/Notification');
const INotificationRepository = require('../../../domain/repositories/INotificationRepository');

class MongoNotificationRepository extends INotificationRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Notification({
      id: doc._id.toString(),
      recipientEmail: doc.recipientEmail,
      recipientRole: doc.recipientRole,
      type: doc.type,
      title: doc.title,
      body: doc.body,
      actionUrl: doc.actionUrl,
      thumbnailUrl: doc.thumbnailUrl,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await NotificationModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByRecipientEmail(email, { isRead, type, page = 1, limit = 20 } = {}) {
    const query = { recipientEmail: email.toLowerCase() };
    if (typeof isRead === 'boolean') {
      query.isRead = isRead;
    }
    if (type) {
      query.type = type;
    }

    const skip = (Math.max(Number(page), 1) - 1) * Number(limit);
    const [docs, total] = await Promise.all([
      NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      NotificationModel.countDocuments(query),
    ]);

    return {
      notifications: docs.map((doc) => this._toDomain(doc)),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }

  async getUnreadCount(email) {
    const count = await NotificationModel.countDocuments({
      recipientEmail: email.toLowerCase(),
      isRead: false,
    });
    return count;
  }

  async markAsRead({ notificationIds = [], recipientEmail, markAll = false }) {
    const query = { recipientEmail: recipientEmail.toLowerCase(), isRead: false };
    if (!markAll && Array.isArray(notificationIds) && notificationIds.length > 0) {
      query._id = { $in: notificationIds };
    }

    const res = await NotificationModel.updateMany(query, {
      $set: { isRead: true, updatedAt: new Date() },
    });
    return res.modifiedCount || 0;
  }

  async save(notification) {
    if (notification.id) {
      const updated = await NotificationModel.findByIdAndUpdate(
        notification.id,
        {
          $set: {
            recipientEmail: notification.recipientEmail.toLowerCase(),
            recipientRole: notification.recipientRole,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            actionUrl: notification.actionUrl,
            thumbnailUrl: notification.thumbnailUrl,
            isRead: notification.isRead,
            updatedAt: new Date(),
          },
        },
        { new: true }
      ).lean();
      return this._toDomain(updated);
    }

    const created = await NotificationModel.create({
      recipientEmail: notification.recipientEmail.toLowerCase(),
      recipientRole: notification.recipientRole,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      actionUrl: notification.actionUrl,
      thumbnailUrl: notification.thumbnailUrl,
      isRead: notification.isRead,
    });
    return this.findById(created._id.toString());
  }

  async deleteById(id) {
    await NotificationModel.findByIdAndDelete(id);
  }
}

module.exports = MongoNotificationRepository;
