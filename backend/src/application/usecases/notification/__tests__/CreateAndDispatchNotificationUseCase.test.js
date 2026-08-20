'use strict';

const CreateAndDispatchNotificationUseCase = require('../CreateAndDispatchNotificationUseCase');
const AppError = require('../../../errors/AppError');

jest.mock('../../../../infrastructure/notifications/NotificationService', () => ({
  dispatch: jest.fn().mockResolvedValue({ success: true })
}));
const notificationService = require('../../../../infrastructure/notifications/NotificationService');

describe('CreateAndDispatchNotificationUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {};
    useCase = new CreateAndDispatchNotificationUseCase({ notificationRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if recipientEmail is missing', async () => {
    await expect(useCase.execute({ title: 't', body: 'b' })).rejects.toThrow(AppError);
  });

  it('should throw if title is missing', async () => {
    await expect(useCase.execute({ recipientEmail: 'e@test.com', body: 'b' })).rejects.toThrow(AppError);
  });

  it('should throw if body is missing', async () => {
    await expect(useCase.execute({ recipientEmail: 'e@test.com', title: 't' })).rejects.toThrow(AppError);
  });

  it('should call notificationService.dispatch on success', async () => {
    await useCase.execute({ recipientEmail: 'client@test.com', title: 'Hello', body: 'World' });
    expect(notificationService.dispatch).toHaveBeenCalled();
  });
});
