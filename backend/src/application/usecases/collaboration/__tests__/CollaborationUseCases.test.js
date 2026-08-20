'use strict';

const CollaborationUseCases = require('../CollaborationUseCases');
const AppError = require('../../../errors/AppError');

describe('CollaborationUseCases', () => {
  let useCases;
  let mockEventRepo;
  let mockCollabRepo;
  let mockStaffRepo;

  beforeEach(() => {
    mockEventRepo = {
      findById: jest.fn().mockResolvedValue({ id: 'e1', studioId: 's1', assignedStaffIds: ['u1'] }),
      update: jest.fn()
    };
    mockCollabRepo = {
      addTeamMember: jest.fn().mockResolvedValue({}),
      getTeam: jest.fn(),
      logActivity: jest.fn(),
      getActivityLog: jest.fn(),
      addComment: jest.fn(),
      getComments: jest.fn()
    };
    mockStaffRepo = {
      findByStudioId: jest.fn().mockResolvedValue([{ userId: 'u1' }, { userId: 'u2' }])
    };

    useCases = new CollaborationUseCases({
      collaborationRepository: mockCollabRepo,
      eventRepository: mockEventRepo,
      staffRepository: mockStaffRepo
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('assignTeamMember: block cross-studio assignment', async () => {
    await expect(useCases.assignTeamMember('e1', 'u99', 'Assistant', 'u1', 'studio_owner'))
      .rejects.toThrow('Cannot assign user from outside the studio.');
  });

  it('assignTeamMember: block client', async () => {
    await expect(useCases.assignTeamMember('e1', 'u2', 'Assistant', 'c1', 'client'))
      .rejects.toThrow('Forbidden.');
  });

  it('assignTeamMember: block unassigned photographer', async () => {
    await expect(useCases.assignTeamMember('e1', 'u2', 'Assistant', 'u99', 'photographer'))
      .rejects.toThrow('Forbidden: Not assigned to this event.');
  });

  it('assignTeamMember: successful assignment and activity log', async () => {
    await useCases.assignTeamMember('e1', 'u2', 'Assistant', 'u1', 'photographer');
    expect(mockCollabRepo.addTeamMember).toHaveBeenCalled();
    expect(mockEventRepo.update).toHaveBeenCalled();
    expect(mockCollabRepo.logActivity).toHaveBeenCalled();
  });

  it('getActivityLog: block client', async () => {
    await expect(useCases.getActivityLog('e1', 'c1', 'client')).rejects.toThrow('Clients cannot view activity history.');
  });

  it('getComments: block client', async () => {
    await expect(useCases.getComments('e1', 'c1', 'client')).rejects.toThrow('Clients cannot view internal comments.');
  });
});
