'use strict';

const SearchPhotographersUseCase = require('../SearchPhotographersUseCase');

describe('SearchPhotographersUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      search: jest.fn().mockResolvedValue({
        photographers: [{ id: 'p1', fullName: 'John Doe' }],
        total: 1,
      }),
    };
    useCase = new SearchPhotographersUseCase(mockRepo);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return paginated photographer results with defaults', async () => {
    const result = await useCase.execute({});
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      limit: 12,
      sortBy: 'newest',
    }));
    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('should pass specialization, minExperience, minRating filters', async () => {
    await useCase.execute({ specialization: 'Portrait', minExperience: '3', minRating: '4' });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({
        specialization: 'portrait', // lowercased
        minExperience: 3,           // parsed int
        minRating: 4,               // parsed float
      }),
    }));
  });

  it('should clamp minRating to [0,5]', async () => {
    await useCase.execute({ minRating: -1 });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({ minRating: 0 }),
    }));
  });

  it('should cap limit at 48', async () => {
    await useCase.execute({ limit: 100 });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({ limit: 48 }));
  });

  it('should compute hasPrevPage correctly on page > 1', async () => {
    mockRepo.search.mockResolvedValue({ photographers: [], total: 50 });
    const result = await useCase.execute({ page: 2, limit: 12 });
    expect(result.pagination.hasPrevPage).toBe(true);
  });
});
