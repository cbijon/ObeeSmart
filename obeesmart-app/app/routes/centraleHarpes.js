// routes/centraleHarpes.js
const express = require('express');
const router = express.Router();
const centraleHarpesController = require('../controllers/centraleHarpesController');

router.get('/', centraleHarpesController.getAllCentraleHarpes);
router.get('/:id', centraleHarpesController.getCentraleHarpesById);
router.post('/', centraleHarpesController.createCentraleHarpes);
router.put('/:id', centraleHarpesController.updateCentraleHarpes);
router.delete('/:id', centraleHarpesController.deleteCentraleHarpes);

module.exports = router;
