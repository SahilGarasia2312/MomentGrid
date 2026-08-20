'use strict';

const UpdateEventStatusUseCase = require('../UpdateEventStatusUseCase');
const AppError = require('../../../errors/AppError');
const Event = require('../../../../domain/entities/Event');

describe('UpdateEventStatusUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = { 
      findById: jest.fn(),
      update: jest.fn().mockImplementation(e => e)
    };
    useCase = new UpdateEventStatusUseCase({ eventRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if client tries to update status', async () => {
    await expect(useCase.execute('e1', 'PLANNED', 'c1', 'client')).rejects.toThrow(AppError);
  });

  it('should successfully update status', async () => {
    const ev = new Event({ title: 'test', status: 'DRAFT' });
    mockRepo.findById.mockResolvedValue(ev);
    
    const res = await useCase.execute('e1', 'PLANNED', 'admin1', 'admin');
    expect(res.status).toBe('PLANNED');
    expect(mockRepo.update).toHaveBeenCalled();
  });
});
