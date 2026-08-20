'use strict';

const GetPlatformOverviewUseCase = require('../GetPlatformOverviewUseCase');

jest.mock('../../../../infrastructure/database/models/UserModel', () => ({
  countDocuments: jest.fn().mockResolvedValue(100),
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }) }),
  aggregate: jest.fn().mockResolvedValue([])
}));
jest.mock('../../../../infrastructure/database/models/StudioModel', () => ({ countDocuments: jest.fn().mockResolvedValue(10) }));
jest.mock('../../../../infrastructure/database/models/PhotographerModel', () => ({ countDocuments: jest.fn().mockResolvedValue(20) }));
jest.mock('../../../../infrastructure/database/models/PaymentModel', () => ({
  aggregate: jest.fn().mockResolvedValue([{ totalCollected: 1000, totalOutstanding: 500, totalInvoices: 10 }]),
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }) })
}));
jest.mock('../../../../infrastructure/database/models/EventModel', () => ({ countDocuments: jest.fn().mockResolvedValue(50) }));
jest.mock('../../../../infrastructure/database/models/GalleryModel', () => ({ countDocuments: jest.fn().mockResolvedValue(30) }));

describe('GetPlatformOverviewUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new GetPlatformOverviewUseCase();
  });

  afterEach(() => jest.clearAllMocks());

  it('should aggregate data successfully', async () => {
    const result = await useCase.execute();
    expect(result.kpis.totalUsers).toBe(100);
    expect(result.kpis.totalStudios).toBe(10);
    expect(result.kpis.totalPhotographers).toBe(20);
    expect(result.kpis.totalBookings).toBe(50);
    expect(result.kpis.totalGalleries).toBe(30);
    expect(result.kpis.totalRevenue).toBe(1000);
  });
});
