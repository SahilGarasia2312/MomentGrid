'use strict';

const ReviewModel = require('../models/ReviewModel');
const Review = require('../../../domain/entities/Review');
const IReviewRepository = require('../../../domain/repositories/IReviewRepository');

class MongoReviewRepository extends IReviewRepository {
  _toDomain(doc) {
    if (!doc) return null;
    return new Review({
      id: doc._id.toString(),
      studioId: doc.studioId.toString(),
      clientName: doc.clientName,
      rating: doc.rating,
      comment: doc.comment,
      isVerified: doc.isVerified,
      isPublic: doc.isPublic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await ReviewModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByStudioId(studioId, onlyPublic = false) {
    const query = { studioId };
    if (onlyPublic) {
      query.isPublic = true;
    }
    const docs = await ReviewModel.find(query).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this._toDomain(doc));
  }

  async save(review) {
    const doc = await ReviewModel.create({
      studioId: review.studioId,
      clientName: review.clientName,
      rating: review.rating,
      comment: review.comment,
      isVerified: review.isVerified,
      isPublic: review.isPublic,
    });
    return this.findById(doc._id.toString());
  }

  async update(review) {
    await ReviewModel.findByIdAndUpdate(
      review.id,
      {
        $set: {
          clientName: review.clientName,
          rating: review.rating,
          comment: review.comment,
          isVerified: review.isVerified,
          isPublic: review.isPublic,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    return this.findById(review.id);
  }

  async delete(id) {
    await ReviewModel.findByIdAndDelete(id);
  }
}

module.exports = MongoReviewRepository;
