const express = require('express');
const router = express.Router();
const { validateStoryInput } = require('../middleware/validateStoryInput');
const { requireAuth } = require('../middleware/requireAuth');
const {
  generateCompleteStory,
  getUserStories,
  getStory,
  saveStory,
  deleteStory
} = require('../controllers/storyController');

//Apply authentication to all routes
// router.use(requireAuth);

// Generate complete story with image
router.post('/generate', validateStoryInput, generateCompleteStory);

// Get user's stories
router.get('/', getUserStories);

// Get specific story
router.get('/:id', getStory);

// Save story to favorites
router.post('/:id/save', saveStory);

// Delete story
router.delete('/:id', deleteStory);

module.exports = router;