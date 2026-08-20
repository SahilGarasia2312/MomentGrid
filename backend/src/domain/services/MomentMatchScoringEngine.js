'use strict';

class MomentMatchScoringEngine {
  constructor(weights = {}) {
    this.weights = {
      availability: weights.availability ?? 0.3,
      budget: weights.budget ?? 0.25,
      location: weights.location ?? 0.15,
      specialization: weights.specialization ?? 0.15,
      rating: weights.rating ?? 0.1,
      style: weights.style ?? 0.05
    };
  }

  scoreCandidates(requirements, candidates) {
    const results = candidates.map(candidate => {
      const breakdown = {
        availability: this._scoreAvailability(candidate.isAvailable),
        budget: this._scoreBudget(requirements.budget, candidate.basePrice),
        location: this._scoreLocation(requirements.location, candidate.location),
        specialization: this._scoreSpecialization(requirements.eventType, candidate.specialties || []),
        rating: this._scoreRating(candidate.rating || 0),
        style: this._scoreStyle(requirements.style, candidate.styles || [])
      };

      let rawScore = 0;
      let totalWeight = 0;
      const reasons = [];

      // Calculate weighted score
      for (const [key, score] of Object.entries(breakdown)) {
        rawScore += score * this.weights[key];
        totalWeight += this.weights[key];
      }

      // Normalize out of 100
      const matchScore = totalWeight > 0 ? Math.round(rawScore / totalWeight) : 0;

      // Generate human readable reasons
      if (breakdown.availability === 100) reasons.push('Available on your event date');
      if (breakdown.budget === 100) reasons.push('Within your budget range');
      else if (breakdown.budget >= 50) reasons.push('Slightly above your budget range');
      if (breakdown.location === 100) reasons.push('Located in your preferred area');
      if (breakdown.specialization === 100) reasons.push(`Specializes in ${requirements.eventType}`);
      if (breakdown.rating >= 90) reasons.push('Highly rated by previous clients');
      if (breakdown.style === 100) reasons.push('Matches your preferred photography style');

      return {
        candidateId: candidate.id,
        matchScore,
        breakdown,
        reasons,
        rating: candidate.rating || 0 // pass through for tie breaking
      };
    });

    // Sort by matchScore desc, then rating desc
    return results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.rating - a.rating;
    });
  }

  _scoreAvailability(isAvailable) {
    return isAvailable ? 100 : 0;
  }

  _scoreBudget(clientBudget, basePrice) {
    if (!clientBudget || !basePrice) return 50; // Neutral if missing
    if (basePrice <= clientBudget) return 100;
    // Penalty for being over budget
    const over = basePrice - clientBudget;
    const penalty = (over / clientBudget) * 100; // e.g. 20% over -> 20 penalty
    const score = 100 - penalty;
    return score < 0 ? 0 : Math.round(score);
  }

  _scoreLocation(reqLocation, candidateLocation) {
    if (!reqLocation) return 100; // Client doesn't care
    if (!candidateLocation) return 0;
    return reqLocation.toLowerCase() === candidateLocation.toLowerCase() ? 100 : 0;
  }

  _scoreSpecialization(reqType, specialties) {
    if (!reqType) return 100;
    return specialties.map(s => s.toLowerCase()).includes(reqType.toLowerCase()) ? 100 : 0;
  }

  _scoreRating(rating) {
    // 5.0 -> 100, 4.0 -> 80
    const normalized = (rating / 5) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
  }

  _scoreStyle(reqStyle, styles) {
    if (!reqStyle) return 100;
    return styles.map(s => s.toLowerCase()).includes(reqStyle.toLowerCase()) ? 100 : 0;
  }
}

module.exports = MomentMatchScoringEngine;
