'use strict';

const ListEventsUseCase = require('../ListEventsUseCase');

describe('ListEventsUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = { searchAndFilter: jest.fn().mockResolvedValue({}) };
    useCase = new ListEventsUseCase({ eventRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should build query for client', async () => {
    await useCase.execute({}, 'c1', 'client');
    expect(mockRepo.searchAndFilter).toHaveBeenCalledWith(expect.objectContaining({ clientId: 'c1' }), expect.any(Object));
  });

  it('should build query for photographer', async () => {
    await useCase.execute({}, 'p1', 'photographer');
    expect(mockRepo.searchAndFilter).toHaveBeenCalledWith(expect.objectContaining({ assignedStaffIds: 'p1' }), expect.any(Object));
  });
});
