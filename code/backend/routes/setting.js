const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');

const {
  getSettings,
  getSettingEnums,
  updateSettings
} = require('../controllers/settingController');

// Apply authentication to all routes
router.use(requireAuth);

// Get settings
router.get('/', getSettings);

// Get settings enums
router.get('/enums', getSettingEnums);

// Update settings
router.put('/update', updateSettings);

module.exports = router;