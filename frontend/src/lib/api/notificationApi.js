'use strict';

import { httpClient } from '../utils/httpClient';

// Fallback sample notifications for offline/demo verification
let fallbackNotifications = [
  {
    id: 'notif_1',
    recipientEmail: 'elena.rossi@momentgrid.com',
    recipientRole: 'client',
    type: 'gallery_ready',
    title: 'Your Master Heirloom Gallery is Live! ✨',
    body: 'Alex Kim has finished color grading your wedding collection. Explore all 284 high-resolution RAW captures and download your favorites.',
    actionUrl: '/gallery-manager',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: 'notif_2',
    recipientEmail: 'elena.rossi@momentgrid.com',
    recipientRole: 'client',
    type: 'album_ready',
    title: 'Luxe Master Album Selection Open 📖',
    body: 'Please select your favorite 40 spreads and choose your Italian Nappa Leather cover finish for the 12x12 Heirloom Album.',
    actionUrl: '/albums',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'notif_3',
    recipientEmail: 'elena.rossi@momentgrid.com',
    recipientRole: 'client',
    type: 'booking_update',
    title: 'Session Confirmed: Villa d\'Este Como 📅',
    body: 'Your photography timeline is locked for October 14, 2026 at 3:30 PM. 2 Master Photographers & Drone Cinematographer assigned.',
    actionUrl: '/book/studio-momentgrid-collective',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&auto=format&fit=crop&q=80',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'notif_4',
    recipientEmail: 'elena.rossi@momentgrid.com',
    recipientRole: 'client',
    type: 'payment_reminder',
    title: 'Cryptographic Escrow: Advance Deposit Verified 💳',
    body: 'Your $960 advance deposit has been successfully verified via Razorpay UPI. Invoice INV-2026-089 active.',
    actionUrl: '/payments',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
];

let fallbackEmailLogs = [
  {
    id: 'eml_initial_1',
    recipientEmail: 'elena.rossi@momentgrid.com',
    type: 'gallery_ready',
    title: 'Your Master Heirloom Gallery is Live! ✨',
    body: 'Alex Kim has finished color grading your wedding collection. Explore all 284 high-resolution RAW captures and download your favorites.',
    actionUrl: '/gallery-manager',
    dispatchedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    htmlContent: `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>body { background-color: #0A0A14; color: #FFFFFF; font-family: sans-serif; padding: 40px; } .card { background: #161628; border: 1px solid #C8A96E; border-radius: 20px; padding: 30px; max-width: 500px; margin: 0 auto; }</style></head><body><div class="card"><h3 style="color:#C8A96E;">✨ Master Gallery Live</h3><h2>Your Master Heirloom Gallery is Live! ✨</h2><p>Alex Kim has finished color grading your wedding collection. Explore all 284 high-resolution RAW captures.</p><a href="http://localhost:3000/gallery-manager" style="background:#C8A96E; color:#000; padding: 12px 24px; border-radius: 10px; text-decoration:none; font-weight:bold; display:inline-block; margin-top:15px;">Enter Heirloom Gallery &rarr;</a></div></body></html>`,
  },
];

export const notificationApi = {
  /**
   * List paginated notifications for a recipient
   */
  async listNotifications({ recipientEmail = 'elena.rossi@momentgrid.com', isRead, type, page = 1, limit = 20 } = {}) {
    try {
      let query = `/notifications?recipientEmail=${encodeURIComponent(recipientEmail)}&page=${page}&limit=${limit}`;
      if (typeof isRead === 'boolean') query += `&isRead=${isRead}`;
      if (type) query += `&type=${encodeURIComponent(type)}`;

      const res = await httpClient(query, { method: 'GET' });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    let list = fallbackNotifications.filter((n) => n.recipientEmail.toLowerCase() === recipientEmail.toLowerCase());
    if (typeof isRead === 'boolean') {
      list = list.filter((n) => n.isRead === isRead);
    }
    if (type && type !== 'all') {
      list = list.filter((n) => n.type === type);
    }

    const unreadCount = fallbackNotifications.filter(
      (n) => n.recipientEmail.toLowerCase() === recipientEmail.toLowerCase() && !n.isRead
    ).length;

    return {
      success: true,
      data: {
        notifications: list,
        unreadCount,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: list.length,
          totalPages: 1,
        },
      },
    };
  },

  /**
   * Get exact unread notification count
   */
  async getUnreadCount(recipientEmail = 'elena.rossi@momentgrid.com') {
    try {
      const res = await httpClient(`/notifications/unread-count?recipientEmail=${encodeURIComponent(recipientEmail)}`, {
        method: 'GET',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    const count = fallbackNotifications.filter(
      (n) => n.recipientEmail.toLowerCase() === recipientEmail.toLowerCase() && !n.isRead
    ).length;

    return {
      success: true,
      data: { unreadCount: count },
    };
  },

  /**
   * Mark selected or all notifications as read
   */
  async markAsRead({ notificationIds = [], recipientEmail = 'elena.rossi@momentgrid.com', markAll = false }) {
    try {
      const res = await httpClient('/notifications/read', {
        method: 'PATCH',
        body: JSON.stringify({ notificationIds, recipientEmail, markAll }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    let markedCount = 0;
    fallbackNotifications.forEach((n) => {
      if (n.recipientEmail.toLowerCase() === recipientEmail.toLowerCase()) {
        if (markAll || (Array.isArray(notificationIds) && notificationIds.includes(n.id))) {
          if (!n.isRead) {
            n.isRead = true;
            markedCount++;
          }
        }
      }
    });

    const unreadCount = fallbackNotifications.filter(
      (n) => n.recipientEmail.toLowerCase() === recipientEmail.toLowerCase() && !n.isRead
    ).length;

    return {
      success: true,
      data: { markedCount, unreadCount },
    };
  },

  /**
   * Dispatch a multi-channel notification
   */
  async dispatch({
    recipientEmail = 'elena.rossi@momentgrid.com',
    recipientRole = 'client',
    type = 'booking_update',
    title,
    body,
    actionUrl = '/client/dashboard',
    thumbnailUrl = null,
    sendEmail = true,
    sendRealTime = true,
  }) {
    try {
      const res = await httpClient('/notifications/dispatch', {
        method: 'POST',
        body: JSON.stringify({
          recipientEmail,
          recipientRole,
          type,
          title,
          body,
          actionUrl,
          thumbnailUrl,
          sendEmail,
          sendRealTime,
        }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    const newNotif = {
      id: `notif_${Date.now()}`,
      recipientEmail,
      recipientRole,
      type,
      title,
      body,
      actionUrl,
      thumbnailUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    fallbackNotifications.unshift(newNotif);

    let htmlPreview = null;
    if (sendEmail) {
      htmlPreview = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>body { background-color: #0A0A14; color: #FFFFFF; font-family: sans-serif; padding: 40px; } .card { background: #161628; border: 1px solid #C8A96E; border-radius: 20px; padding: 30px; max-width: 500px; margin: 0 auto; }</style></head><body><div class="card"><h3 style="color:#C8A96E;">M O M E N T G R I D • A L E R T</h3><h2>${title}</h2><p>${body}</p><a href="http://localhost:3000${actionUrl}" style="background:#C8A96E; color:#000; padding: 12px 24px; border-radius: 10px; text-decoration:none; font-weight:bold; display:inline-block; margin-top:15px;">View in Portal &rarr;</a></div></body></html>`;

      fallbackEmailLogs.unshift({
        id: `eml_${Date.now()}`,
        recipientEmail,
        type,
        title,
        body,
        actionUrl,
        dispatchedAt: new Date().toISOString(),
        htmlContent: htmlPreview,
      });
    }

    return {
      success: true,
      data: {
        notification: newNotif,
        emailDispatched: sendEmail,
        realTimeBroadcasted: sendRealTime,
        htmlEmailPreview: htmlPreview,
      },
    };
  },

  /**
   * Simulate a prebuilt system reminder
   */
  async simulateReminder({ recipientEmail = 'elena.rossi@momentgrid.com', reminderType = 'gallery_ready' }) {
    try {
      const res = await httpClient('/notifications/simulate', {
        method: 'POST',
        body: JSON.stringify({ recipientEmail, reminderType }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    let type = 'gallery_ready';
    let title = 'Your Master Heirloom Gallery is Live! ✨';
    let body = 'Alex Kim has finished color grading your wedding collection. Explore all 284 high-resolution RAW captures and download your favorites.';
    let actionUrl = '/gallery-manager';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80';

    if (reminderType === 'booking_update') {
      type = 'booking_update';
      title = 'Session Confirmed: Villa d\'Este Como 📅';
      body = 'Your photography timeline is locked for October 14, 2026 at 3:30 PM. 2 Master Photographers & Drone Cinematographer assigned.';
      actionUrl = '/book/studio-momentgrid-collective';
      thumbnailUrl = 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&auto=format&fit=crop&q=80';
    } else if (reminderType === 'album_ready') {
      type = 'album_ready';
      title = 'Luxe Album Selection Open 📖';
      body = 'Please choose your favorite 45 spreads and select your Italian Nappa Leather cover material for the 12x12 Master Album.';
      actionUrl = '/albums';
      thumbnailUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    } else if (reminderType === 'payment_reminder') {
      type = 'payment_reminder';
      title = 'Cryptographic Escrow: Remaining Balance Due 💳';
      body = 'Your $960 advance deposit is verified. Please settle the remaining $1,820 balance via Razorpay before final digital rights release.';
      actionUrl = '/payments';
      thumbnailUrl = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80';
    }

    return this.dispatch({
      recipientEmail,
      recipientRole: 'client',
      type,
      title,
      body,
      actionUrl,
      thumbnailUrl,
      sendEmail: true,
      sendRealTime: true,
    });
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id) {
    try {
      await httpClient(`/notifications/${id}`, { method: 'DELETE' });
      return { success: true };
    } catch (e) {
      // Fallback
    }

    fallbackNotifications = fallbackNotifications.filter((n) => n.id !== id);
    return { success: true };
  },

  /**
   * Inspect HTML email dispatch logs
   */
  async getEmailLog(email = 'elena.rossi@momentgrid.com') {
    try {
      const res = await httpClient(`/notifications/email-log?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    return {
      success: true,
      data: fallbackEmailLogs.filter((l) => l.recipientEmail.toLowerCase() === email.toLowerCase()),
    };
  },
};
