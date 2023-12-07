const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const { body } = require('express-validator'); // Add this line for form validation



// Handle form submission for updating user preferences
router.post(
  '/updatepref',
  [
    // Add express-validator validations here as needed
    body('login').notEmpty().withMessage('Login is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    // Add validations for other fields
  ],
  preferencesController.updatePreferences
);

module.exports = router;