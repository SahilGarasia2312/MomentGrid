'use strict';

const CreateEventUseCase = require('../CreateEventUseCase');
const AppError = require('../../../errors/AppError');
const Event = require('../../../../domain/entities/Event');

describe('CreateEventUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = { save: jest.fn().mockImplementation(e => e) };
    useCase = new CreateEventUseCase({ eventRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if studioId missing', async () => {
    await expect(useCase.execute({ title: 't' }, 'admin', 'user1')).rejects.toThrow(AppError);
  });

  it('should throw if user is client', async () => {
    await expect(useCase.execute({ studioId: 's1', title: 't' }, 'client', 'user1')).rejects.toThrow(AppError);
  });

  it('should save valid event with DRAFT status', async () => {
    const res = await useCase.execute({ studioId: 's1', title: 'test' }, 'admin', 'user1');
    expect(res.status).toBe(Event.STATUSES.DRAFT);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
