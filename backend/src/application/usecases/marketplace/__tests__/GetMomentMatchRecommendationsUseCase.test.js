'use strict';

const GetMomentMatchRecommendationsUseCase = require('../GetMomentMatchRecommendationsUseCase');

describe('GetMomentMatchRecommendationsUseCase', () => {
  let useCase;
  let mockStudioRepo, mockPackageRepo, mockEventRepo;

  beforeEach(() => {
    mockStudioRepo = {
      search: jest.fn().mockResolvedValue({
        studios: [
          { id: 's1', name: 'Studio One' },
          { id: 's2', name: 'Studio Two' }
        ]
      })
    };
    mockPackageRepo = {
      findByStudioId: jest.fn().mockImplementation((id) => {
        if (id === 's1') return [{ price: 500 }];
        if (id === 's2') return [{ price: 1500 }];
        return [];
      })
    };
    mockEventRepo = {
      findByStudioId: jest.fn().mockImplementation((id) => {
        if (id === 's1') return [{ eventDate: new Date('2026-12-01T00:00:00Z') }]; // booked on 2026-12-01
        return [];
      })
    };

    useCase = new GetMomentMatchRecommendationsUseCase({
      studioRepository: mockStudioRepo,
      packageRepository: mockPackageRepo,
      eventRepository: mockEventRepo
    });
  });

  it('filters unavailable and scores by budget', async () => {
    const reqs = { date: '2026-12-01', budget: 1000 };
    const results = await useCase.execute(reqs);

    expect(results).toHaveLength(2);
    // s1 is unavailable (score 0 for availability), but within budget
    // s2 is available (100 for availability), but over budget
    const s1 = results.find(r => r.candidateId === 's1');
    const s2 = results.find(r => r.candidateId === 's2');
    
    expect(s1.breakdown.availability).toBe(0);
    expect(s2.breakdown.availability).toBe(100);
    expect(s1.breakdown.budget).toBe(100); // 500 <= 1000
    expect(s2.breakdown.budget).toBe(50); // 1500 is 50% over budget (penalty 50)
  });
});
