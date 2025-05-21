const express = require('express');

// controller functions
const { loginUser, registerUser, logoutUser, getUserProfile } = require('../controllers/userController');
const router = express.Router();

// Login route
router.post('/login', loginUser);

// Register route
router.post('/register', registerUser);

// Logout route
router.post('/logout', logoutUser);

// Profile route
router.get('/profile', (req, res) => {
  // Handle profile logic here
}); 

module.exports = router;