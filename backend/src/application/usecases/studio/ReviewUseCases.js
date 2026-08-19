'use strict';

const AppError = require('../../errors/AppError');
const Review = require('../../../domain/entities/Review');

class ListReviewsUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute({ studioId, onlyPublic }) {
    return await this.reviewRepository.findByStudioId(studioId, onlyPublic);
  }
}

class CreateReviewUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute({ studioId, clientName, rating, comment, isVerified }) {
    const review = new Review({
      studioId,
      clientName,
      rating,
      comment,
      isVerified: isVerified ?? true,
      isPublic: true,
    });

    return await this.reviewRepository.save(review);
  }
}

class ToggleReviewVisibilityUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute({ reviewId, studioId }) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review || review.studioId !== studioId) {
      throw new AppError('Review not found in this studio.', 404, 'REVIEW_NOT_FOUND');
    }

    review.isPublic = !review.isPublic;
    return await this.reviewRepository.update(review);
  }
}

class DeleteReviewUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute({ reviewId, studioId }) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review || review.studioId !== studioId) {
      throw new AppError('Review not found in this studio.', 404, 'REVIEW_NOT_FOUND');
    }

    await this.reviewRepository.delete(reviewId);
    return { success: true, message: 'Review deleted successfully.' };
  }
}

module.exports = {
  ListReviewsUseCase,
  CreateReviewUseCase,
  ToggleReviewVisibilityUseCase,
  DeleteReviewUseCase,
};
