'use strict';
const express = require('express');
const { Harpe } = require('../models');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Obtenir toutes les harpes
router.get('/', asyncHandler(async (req, res) => {
  try {
    const harpes = await Harpe.findAll();
    res.json(harpes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Obtenir une harpe par ID
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      res.json(harpe);
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Créer une nouvelle harpe
router.post('/', asyncHandler(async (req, res) => {
  try {
    const newHarpe = await Harpe.create(req.body);
    res.json(newHarpe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Mettre à jour une harpe
router.put('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      await harpe.update(req.body);
      res.json(harpe);
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Supprimer une harpe
router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      await harpe.destroy();
      res.json({ message: 'Harpe deleted successfully' });
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

module.exports = router;
