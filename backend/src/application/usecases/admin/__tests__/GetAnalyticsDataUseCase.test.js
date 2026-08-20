'use strict';

const GetAnalyticsDataUseCase = require('../GetAnalyticsDataUseCase');

jest.mock('../../../../infrastructure/database/models/UserModel', () => ({
  aggregate: jest.fn().mockResolvedValue([])
}));
jest.mock('../../../../infrastructure/database/models/EventModel', () => ({
  aggregate: jest.fn().mockResolvedValue([])
}));
jest.mock('../../../../infrastructure/database/models/GalleryModel', () => ({
  aggregate: jest.fn().mockResolvedValue([])
}));
jest.mock('../../../../infrastructure/database/models/NotificationModel', () => ({
  aggregate: jest.fn().mockResolvedValue([])
}));

describe('GetAnalyticsDataUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new GetAnalyticsDataUseCase();
  });

  afterEach(() => jest.clearAllMocks());

  it('should aggregate analytics successfully', async () => {
    const UserModel = require('../../../../infrastructure/database/models/UserModel');
    UserModel.aggregate.mockResolvedValueOnce([{ _id: '2026-08-01', count: 5 }]); // userGrowth
    UserModel.aggregate.mockResolvedValueOnce([{ _id: 'client', count: 50 }]); // roleDistribution
    UserModel.aggregate.mockResolvedValueOnce([{ _id: 'active', count: 45 }]); // statusDistribution

    const EventModel = require('../../../../infrastructure/database/models/EventModel');
    EventModel.aggregate.mockResolvedValueOnce([{ _id: '2026-08', count: 10 }]); // bookingsByMonth
    
    const GalleryModel = require('../../../../infrastructure/database/models/GalleryModel');
    GalleryModel.aggregate.mockResolvedValueOnce([{ _id: '2026-W30', count: 15 }]); // galleryUploads
    
    const NotificationModel = require('../../../../infrastructure/database/models/NotificationModel');
    NotificationModel.aggregate.mockResolvedValueOnce([{ _id: 'booking_update', count: 20 }]); // notificationsByType

    const result = await useCase.execute();
    
    expect(result.userGrowth[0].count).toBe(5);
    expect(result.roleDistribution[0].role).toBe('client');
    expect(result.bookingsByMonth[0].month).toBe('2026-08');
    expect(result.galleryUploads[0].count).toBe(15);
    expect(result.notificationsByType[0].type).toBe('booking_update');
    expect(result.statusDistribution[0].status).toBe('active');
  });
});
