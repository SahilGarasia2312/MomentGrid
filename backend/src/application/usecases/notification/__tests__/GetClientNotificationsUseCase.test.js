'use strict';

const GetClientNotificationsUseCase = require('../GetClientNotificationsUseCase');
const AppError = require('../../../errors/AppError');

describe('GetClientNotificationsUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findByRecipientEmail: jest.fn().mockResolvedValue({
        notifications: [{ id: 'n1' }],
        pagination: { page: 1, totalItems: 1 }
      }),
      getUnreadCount: jest.fn().mockResolvedValue(1)
    };
    useCase = new GetClientNotificationsUseCase({ notificationRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if recipientEmail is missing', async () => {
    await expect(useCase.execute({})).rejects.toThrow(AppError);
  });

  it('should return notifications and unread count', async () => {
    const result = await useCase.execute({ recipientEmail: 'client@test.com' });
    expect(result.notifications).toHaveLength(1);
    expect(result.unreadCount).toBe(1);
    expect(result.pagination.page).toBe(1);
    expect(mockRepo.findByRecipientEmail).toHaveBeenCalled();
    expect(mockRepo.getUnreadCount).toHaveBeenCalled();
  });
});
