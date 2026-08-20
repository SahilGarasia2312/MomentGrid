'use strict';

const MomentMatchScoringEngine = require('../MomentMatchScoringEngine');

describe('MomentMatchScoringEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new MomentMatchScoringEngine();
  });

  const reqs = {
    budget: 1000,
    location: 'New York',
    eventType: 'Wedding',
    style: 'Candid'
  };

  it('scores a perfect match 100', () => {
    const candidate = {
      id: 'c1',
      isAvailable: true,
      basePrice: 900,
      location: 'New York',
      specialties: ['Wedding', 'Portrait'],
      styles: ['Candid'],
      rating: 5.0
    };

    const result = engine.scoreCandidates(reqs, [candidate]);
    expect(result[0].matchScore).toBe(100);
    expect(result[0].reasons).toContain('Available on your event date');
    expect(result[0].reasons).toContain('Within your budget range');
  });

  it('scores an unavailable candidate heavily down', () => {
    const candidate = {
      id: 'c1',
      isAvailable: false, // 0 for 30% of score
      basePrice: 900,
      location: 'New York',
      specialties: ['Wedding'],
      styles: ['Candid'],
      rating: 5.0
    };

    const result = engine.scoreCandidates(reqs, [candidate]);
    expect(result[0].breakdown.availability).toBe(0);
    expect(result[0].matchScore).toBeLessThan(80);
  });

  it('scores an over budget candidate down', () => {
    const candidate = {
      id: 'c1',
      isAvailable: true,
      basePrice: 1500, // 50% over budget
      location: 'New York',
      specialties: ['Wedding'],
      styles: ['Candid'],
      rating: 5.0
    };

    const result = engine.scoreCandidates(reqs, [candidate]);
    expect(result[0].breakdown.budget).toBe(50); // 100 - 50 penalty
    expect(result[0].matchScore).toBeLessThan(100);
    expect(result[0].reasons).toContain('Slightly above your budget range');
  });

  it('sorts correctly and handles ties', () => {
    const c1 = { id: 'c1', isAvailable: true, basePrice: 1000, rating: 4.0 };
    const c2 = { id: 'c2', isAvailable: true, basePrice: 1000, rating: 5.0 }; // Same score, higher rating

    const result = engine.scoreCandidates({}, [c1, c2]);
    expect(result[0].candidateId).toBe('c2');
    expect(result[1].candidateId).toBe('c1');
  });
});
