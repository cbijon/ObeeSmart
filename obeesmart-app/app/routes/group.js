const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

// Associer les routes aux fonctions correspondantes dans le contrôleur

router.get('/groups', groupController.manageGroups);
router.post('/create', groupController.createGroup);
router.get('/:group_id/destroy', groupController.destroyGroup);
router.get('/:group_id/edit', groupController.editGroup);
router.post('/:group_id/update', groupController.updateGroup);

module.exports = router;
