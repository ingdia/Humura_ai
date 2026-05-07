const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  reactToPost,
  deletePost,
  getGroups
} = require('../controllers/communityController');
const { protect } = require('../middlewares/authMiddleware');

// Group Routes
router.get('/groups', protect, getGroups);

// Group-specific Post Routes
router.route('/:groupId/posts')
  .get(protect, getPosts)
  .post(protect, createPost);

// Specific Post Routes
router.route('/posts/:id')
  .delete(protect, deletePost);

router.route('/posts/:id/react')
  .post(protect, reactToPost);

module.exports = router;
