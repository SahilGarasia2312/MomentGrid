'use strict';

const SearchStudiosUseCase = require('../SearchStudiosUseCase');

describe('SearchStudiosUseCase', () => {
  let useCase;
  let mockRepo;

  const makeStudio = (overrides = {}) => ({
    toPublic: jest.fn().mockReturnValue({ id: 's1', name: 'Studio A', ...overrides }),
  });

  beforeEach(() => {
    mockRepo = {
      search: jest.fn().mockResolvedValue({
        studios: [makeStudio()],
        total: 1,
      }),
    };
    useCase = new SearchStudiosUseCase(mockRepo);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return paginated studio results with defaults', async () => {
    const result = await useCase.execute({});
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      limit: 12,
      sortBy: 'newest',
    }));
    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(result.pagination.hasNextPage).toBe(false);
  });

  it('should sanitize page and limit to safe bounds', async () => {
    await useCase.execute({ page: 0, limit: 9999 });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
      limit: 48, // capped at max
    }));
  });

  it('should pass query, location, and specialization filters', async () => {
    await useCase.execute({ query: 'Lens', location: 'Mumbai', specialization: 'Wedding' });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({
        query: 'Lens',
        location: 'Mumbai',
        specialization: 'wedding', // lowercased
      }),
    }));
  });

  it('should clamp minRating between 0 and 5', async () => {
    await useCase.execute({ minRating: 99 });
    expect(mockRepo.search).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({ minRating: 5 }),
    }));
  });

  it('should correctly calculate hasNextPage when more results exist', async () => {
    mockRepo.search.mockResolvedValue({ studios: [makeStudio()], total: 25 });
    const result = await useCase.execute({ page: 1, limit: 12 });
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.totalPages).toBe(3); // ceil(25/12)
  });
});
