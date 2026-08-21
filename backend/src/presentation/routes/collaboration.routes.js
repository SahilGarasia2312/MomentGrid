'use strict';

const { Router } = require('express');
const CollaborationController = require('../controllers/CollaborationController');
const authenticate = require('../middleware/authenticate');
const {
  teamAssignmentValidator,
  commentValidator
} = require('../validators/collaboration.validators');

// Note: Mounted on /v1/events/:eventId
const router = Router({ mergeParams: true });

router.use(authenticate);

// Team Assignment
router.route('/team')
  .get(CollaborationController.getTeam)
  .post(teamAssignmentValidator, CollaborationController.assignTeamMember);

// Activity Log
router.route('/activity')
  .get(CollaborationController.getActivityLog);

// Internal Comments
router.route('/comments')
  .get(CollaborationController.getComments)
  .post(commentValidator, CollaborationController.addComment);

module.exports = router;
