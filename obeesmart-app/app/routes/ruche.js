// routes/ruche.js
const express = require('express');
const router = express.Router();
const rucheController = require('../controllers/rucheController');

router.get('/', rucheController.getAllRuches);
router.get('/:id', rucheController.getRucheById);
router.post('/', rucheController.createRuche);
router.put('/:id', rucheController.updateRuche);
router.delete('/:id', rucheController.deleteRuche);

module.exports = router;
