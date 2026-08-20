'use strict';

const GetEventDetailsUseCase = require('../GetEventDetailsUseCase');
const AppError = require('../../../errors/AppError');

describe('GetEventDetailsUseCase', () => {
  let useCase;
  let mockRepo;

  beforeEach(() => {
    mockRepo = { findById: jest.fn() };
    useCase = new GetEventDetailsUseCase({ eventRepository: mockRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('should throw if not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('e1', 'u1', 'client')).rejects.toThrow(AppError);
  });

  it('should throw if client tries to access another clients event', async () => {
    mockRepo.findById.mockResolvedValue({ clientId: 'u2', clientEmail: 'test2@test.com' });
    await expect(useCase.execute('e1', 'u1', 'client')).rejects.toThrow('Forbidden: Not your event.');
  });

  it('should throw if photographer tries to access unassigned event', async () => {
    mockRepo.findById.mockResolvedValue({ assignedStaffIds: ['staff2'] });
    await expect(useCase.execute('e1', 'staff1', 'photographer')).rejects.toThrow('Forbidden: Not assigned to this event.');
  });

  it('should succeed for owner client', async () => {
    mockRepo.findById.mockResolvedValue({ clientId: 'u1' });
    const res = await useCase.execute('e1', 'u1', 'client');
    expect(res.clientId).toBe('u1');
  });

  it('should succeed for assigned photographer', async () => {
    mockRepo.findById.mockResolvedValue({ assignedStaffIds: ['staff1'] });
    const res = await useCase.execute('e1', 'staff1', 'photographer');
    expect(res.assignedStaffIds).toContain('staff1');
  });
});
