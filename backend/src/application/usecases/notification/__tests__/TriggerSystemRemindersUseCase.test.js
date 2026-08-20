'use strict';

const TriggerSystemRemindersUseCase = require('../TriggerSystemRemindersUseCase');
const AppError = require('../../../errors/AppError');

jest.mock('../../../../infrastructure/notifications/NotificationService', () => ({
  dispatch: jest.fn().mockResolvedValue({ success: true })
}));
const notificationService = require('../../../../infrastructure/notifications/NotificationService');

describe('TriggerSystemRemindersUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {};
    useCase = new TriggerSystemRemindersUseCase({ notificationRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if recipientEmail is missing', async () => {
    await expect(useCase.execute({ reminderType: 'booking_update' })).rejects.toThrow(AppError);
  });

  it('should dispatch gallery_ready reminder by default', async () => {
    await useCase.execute({ recipientEmail: 'client@test.com' });
    expect(notificationService.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      recipientEmail: 'client@test.com',
      type: 'gallery_ready'
    }));
  });

  it('should dispatch booking_update reminder', async () => {
    await useCase.execute({ recipientEmail: 'client@test.com', reminderType: 'booking_update' });
    expect(notificationService.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      recipientEmail: 'client@test.com',
      type: 'booking_update'
    }));
  });

  it('should dispatch album_ready reminder', async () => {
    await useCase.execute({ recipientEmail: 'client@test.com', reminderType: 'album_ready' });
    expect(notificationService.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      recipientEmail: 'client@test.com',
      type: 'album_ready'
    }));
  });

  it('should dispatch payment_reminder reminder', async () => {
    await useCase.execute({ recipientEmail: 'client@test.com', reminderType: 'payment_reminder' });
    expect(notificationService.dispatch).toHaveBeenCalledWith(expect.objectContaining({
      recipientEmail: 'client@test.com',
      type: 'payment_reminder'
    }));
  });
});
