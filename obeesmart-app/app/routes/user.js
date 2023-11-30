const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Associer les routes aux fonctions correspondantes dans le contrôleur

router.get('/', userController.getAllUser);
router.get('/:userId', userController.getUserById);
router.post('/create', userController.createUser);
router.put('/:userId/update', userController.updateUser);
router.delete('/:userId/destroy', userController.deleteUser);

// Activer un utilisateur
router.get('/:userId/enable', userController.enableUser);

// Désactiver un utilisateur
router.get('/:userId/disable', userController.disableUser);


module.exports = router;