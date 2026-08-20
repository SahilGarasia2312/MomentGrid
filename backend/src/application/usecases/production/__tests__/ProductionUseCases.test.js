'use strict';

const ProductionUseCases = require('../ProductionUseCases');
const AppError = require('../../../errors/AppError');

describe('ProductionUseCases', () => {
  let useCase;
  let mockEventRepo;
  let mockProductionRepo;

  beforeEach(() => {
    mockEventRepo = { findById: jest.fn() };
    mockProductionRepo = {
      getTimeline: jest.fn(), addTimelineItem: jest.fn(), updateTimelineItem: jest.fn(), removeTimelineItem: jest.fn(),
      getTasks: jest.fn(), addTask: jest.fn(), updateTask: jest.fn(), removeTask: jest.fn(),
      getShots: jest.fn(), addShot: jest.fn(), updateShot: jest.fn(), removeShot: jest.fn(),
      getDeliverables: jest.fn(), addDeliverable: jest.fn(), updateDeliverable: jest.fn(), removeDeliverable: jest.fn(),
    };
    useCase = new ProductionUseCases({ eventRepository: mockEventRepo, productionRepository: mockProductionRepo });
  });

  afterEach(() => jest.clearAllMocks());

  it('verifies client access for allowed resources', async () => {
    mockEventRepo.findById.mockResolvedValue({ clientId: 'u1' });
    await useCase.getTimeline('e1', 'u1', 'client');
    expect(mockProductionRepo.getTimeline).toHaveBeenCalledWith('e1');
  });

  it('denies client access for tasks', async () => {
    mockEventRepo.findById.mockResolvedValue({ clientId: 'u1' });
    await expect(useCase.getTasks('e1', 'u1', 'client')).rejects.toThrow('Forbidden: Clients cannot access this resource.');
  });

  it('denies photographer access if unassigned', async () => {
    mockEventRepo.findById.mockResolvedValue({ assignedStaffIds: ['staff2'] });
    await expect(useCase.addTask('e1', { task: 't' }, 'staff1', 'photographer')).rejects.toThrow('Forbidden: Not assigned to this event.');
  });

  it('allows assigned photographer to add tasks', async () => {
    mockEventRepo.findById.mockResolvedValue({ assignedStaffIds: ['staff1'] });
    mockProductionRepo.addTask.mockResolvedValue({ id: 't1' });
    const res = await useCase.addTask('e1', { task: 't' }, 'staff1', 'photographer');
    expect(res.id).toBe('t1');
  });
});
