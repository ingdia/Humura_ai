const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  reactToPost,
  deletePost,
} = require('../controllers/communityController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/posts')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/posts/:id')
  .delete(protect, deletePost);

router.route('/posts/:id/react')
  .post(protect, reactToPost);

module.exports = router;
