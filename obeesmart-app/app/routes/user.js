const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Associer les routes aux fonctions correspondantes dans le contrôleur

router.get('/users', userController.getAllUser);
router.get('/users/:userId', userController.getUserById);
router.post('/users/create', userController.createUser);
router.put('/users/:userId/update', userController.updateUser);
router.delete('/users/:userId/destroy', userController.deleteUser);
// Activer un utilisateur
router.get('/users/:userId/enable', userController.enableUser);
// Désactiver un utilisateur
router.get('/users/:userId/disable', userController.disableUser);
router.get("/logout", userController.logoutUser);

module.exports = router;