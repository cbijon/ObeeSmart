const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');

// Récupérer tous les écrans
router.get('/screens', screenController.getAllScreens);

// Récupérer un écran par ID
router.get('/screens/:id', screenController.getScreenById);

// Créer un nouvel écran
router.post('/screens/create', screenController.createScreen);

// Mettre à jour un écran par ID
router.put('/screens/:id/update', screenController.updateScreen);

// Supprimer un écran par ID
router.delete('/screens/:id/delete', screenController.deleteScreen);

module.exports = router;