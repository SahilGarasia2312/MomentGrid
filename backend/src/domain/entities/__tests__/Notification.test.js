'use strict';

const Notification = require('../Notification');

describe('Notification domain entity', () => {
  it('should initialize with correct default values', () => {
    const notification = new Notification({
      recipientEmail: 'client@test.com',
      title: 'Test Notification',
      body: 'Test Body',
    });

    expect(notification.recipientEmail).toBe('client@test.com');
    expect(notification.recipientRole).toBe('client');
    expect(notification.type).toBe('booking_update');
    expect(notification.title).toBe('Test Notification');
    expect(notification.body).toBe('Test Body');
    expect(notification.actionUrl).toBe('/client/dashboard');
    expect(notification.isRead).toBe(false);
  });

  it('should mark as read', () => {
    const notification = new Notification({ recipientEmail: 'client@test.com' });
    notification.markAsRead();
    expect(notification.isRead).toBe(true);
  });

  it('should mark as unread', () => {
    const notification = new Notification({ recipientEmail: 'client@test.com', isRead: true });
    notification.markAsUnread();
    expect(notification.isRead).toBe(false);
  });

  it('should return correct payload', () => {
    const notification = new Notification({
      id: 'notif_1',
      recipientEmail: 'client@test.com',
      title: 'Test',
      body: 'Test Body'
    });
    const payload = notification.toPayload();
    expect(payload.id).toBe('notif_1');
    expect(payload.recipient_email).toBe('client@test.com');
    expect(payload.is_read).toBe(false);
    expect(payload.action_url).toBe('/client/dashboard');
  });
});
