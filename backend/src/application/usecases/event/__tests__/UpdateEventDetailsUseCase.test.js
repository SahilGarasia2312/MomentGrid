'use strict';

const UpdateEventDetailsUseCase = require('../UpdateEventDetailsUseCase');
const AppError = require('../../../errors/AppError');
const Event = require('../../../../domain/entities/Event');

describe('UpdateEventDetailsUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = { 
      findById: jest.fn(),
      update: jest.fn().mockImplementation(e => e)
    };
    useCase = new UpdateEventDetailsUseCase({ eventRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if client tries to update', async () => {
    await expect(useCase.execute('e1', {}, 'c1', 'client')).rejects.toThrow(AppError);
  });

  it('should successfully update event', async () => {
    const ev = new Event({ title: 'old' });
    mockRepo.findById.mockResolvedValue(ev);
    
    const res = await useCase.execute('e1', { title: 'new' }, 'admin1', 'admin');
    expect(res.title).toBe('new');
    expect(mockRepo.update).toHaveBeenCalled();
  });
});
