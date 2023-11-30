// routes/tokens.js
'use strict';
const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

router.post('/generate', tokenController.generateToken);
router.get('/validate/:token', tokenController.validateToken);
router.delete('/:token', tokenController.deleteToken);

module.exports = router;
