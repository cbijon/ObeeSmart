'use strict';
const express = require('express');
const { Harpe } = require('../models');
const asyncHandler = require('express-async-handler');

const router = express.Router();

// Middleware de vérification de session
const checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next(); // Si la session existe, continuez
  } else {
    res.redirect('/login'); // Sinon, redirigez vers la page de connexion
  }
};

// Appliquer le middleware à toutes les routes
router.use(checkSession);

// Obtenir toutes les harpes
router.get('/', asyncHandler(async (req, res) => {
  const harpes = await Harpe.findAll();
  res.json(harpes);
}));

// Obtenir une harpe par ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const harpe = await Harpe.findByPk(id);
  if (harpe) {
    res.json(harpe);
  } else {
    res.status(404).json({ error: 'Harpe not found' });
  }
}));

// Créer une nouvelle harpe
router.post('/', asyncHandler(async (req, res) => {
  const newHarpe = await Harpe.create(req.body);
  res.json(newHarpe);
}));

// Mettre à jour une harpe
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const harpe = await Harpe.findByPk(id);
  if (harpe) {
    await harpe.update(req.body);
    res.json(harpe);
  } else {
    res.status(404).json({ error: 'Harpe not found' });
  }
}));

// Supprimer une harpe
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const harpe = await Harpe.findByPk(id);
  if (harpe) {
    await harpe.destroy();
    res.json({ message: 'Harpe deleted successfully' });
  } else {
    res.status(404).json({ error: 'Harpe not found' });
  }
}));

module.exports = router;
