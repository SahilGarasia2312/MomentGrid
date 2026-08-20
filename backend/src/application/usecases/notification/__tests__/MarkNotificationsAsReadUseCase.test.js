'use strict';

const MarkNotificationsAsReadUseCase = require('../MarkNotificationsAsReadUseCase');
const AppError = require('../../../errors/AppError');

jest.mock('../../../../infrastructure/notifications/NotificationService', () => ({
  broadcastToStream: jest.fn()
}));
const notificationService = require('../../../../infrastructure/notifications/NotificationService');

describe('MarkNotificationsAsReadUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      markAsRead: jest.fn().mockResolvedValue(2),
      getUnreadCount: jest.fn().mockResolvedValue(0)
    };
    useCase = new MarkNotificationsAsReadUseCase({ notificationRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if recipientEmail is missing', async () => {
    await expect(useCase.execute({ notificationIds: ['n1'] })).rejects.toThrow(AppError);
  });

  it('should throw if notificationIds empty and markAll is false', async () => {
    await expect(useCase.execute({ recipientEmail: 'client@test.com', markAll: false, notificationIds: [] })).rejects.toThrow(AppError);
  });

  it('should mark as read and broadcast updated count', async () => {
    const result = await useCase.execute({ recipientEmail: 'client@test.com', notificationIds: ['n1', 'n2'] });
    expect(result.markedCount).toBe(2);
    expect(result.unreadCount).toBe(0);
    expect(mockRepo.markAsRead).toHaveBeenCalled();
    expect(notificationService.broadcastToStream).toHaveBeenCalledWith('client@test.com', 'unread_count_updated', { count: 0 });
  });
});
