// routes/harpe.js
const express = require('express');
const router = express.Router();
const harpeController = require('../controllers/harpeController');

router.get('/', harpeController.getAllHarpes);
router.get('/:id', harpeController.getHarpeById);
router.post('/', harpeController.createHarpe);
router.put('/:id', harpeController.updateHarpe);
router.delete('/:id', harpeController.deleteHarpe);

module.exports = router;
