'use strict';

const { EventTeamAssignmentModel, EventActivityModel, EventCommentModel } = require('../models/EventCollaborationModels');
const EventTeamAssignment = require('../../../domain/entities/collaboration/EventTeamAssignment');
const EventActivity = require('../../../domain/entities/collaboration/EventActivity');
const EventComment = require('../../../domain/entities/collaboration/EventComment');
const AppError = require('../../../application/errors/AppError');

class MongoCollaborationRepository {
  // --- Team Assignment ---
  async getTeam(eventId) {
    const docs = await EventTeamAssignmentModel.find({ eventId }).lean();
    return docs.map(d => new EventTeamAssignment({ ...d, id: d._id.toString(), eventId: d.eventId.toString(), userId: d.userId.toString() }));
  }

  async addTeamMember(assignment) {
    try {
      const doc = await EventTeamAssignmentModel.create(assignment);
      return new EventTeamAssignment({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString(), userId: doc.userId.toString() });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('User is already assigned to this event.', 409, 'DUPLICATE_ASSIGNMENT');
      }
      throw err;
    }
  }

  async removeTeamMember(eventId, userId) {
    await EventTeamAssignmentModel.findOneAndDelete({ eventId, userId });
  }

  async isUserInTeam(eventId, userId) {
    const doc = await EventTeamAssignmentModel.findOne({ eventId, userId }).lean();
    return !!doc;
  }

  // --- Activity Log ---
  async getActivityLog(eventId) {
    const docs = await EventActivityModel.find({ eventId }).sort({ createdAt: -1 }).lean();
    return docs.map(d => new EventActivity({ ...d, id: d._id.toString(), eventId: d.eventId.toString() }));
  }

  async logActivity(activity) {
    const doc = await EventActivityModel.create(activity);
    return new EventActivity({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString() });
  }

  // --- Comments ---
  async getComments(eventId, referenceType = 'EVENT', referenceId = null) {
    const query = { eventId, referenceType };
    if (referenceId) query.referenceId = referenceId;
    const docs = await EventCommentModel.find(query).sort({ createdAt: 1 }).lean();
    return docs.map(d => new EventComment({ ...d, id: d._id.toString(), eventId: d.eventId.toString(), authorId: d.authorId.toString() }));
  }

  async addComment(comment) {
    const doc = await EventCommentModel.create(comment);
    return new EventComment({ ...doc.toObject(), id: doc._id.toString(), eventId: doc.eventId.toString(), authorId: doc.authorId.toString() });
  }
}

module.exports = MongoCollaborationRepository;
