const express = require('express');
const { validationResult } = require('express-validator');
const { Scale } = require('../models'); // Ajustez le chemin si nécessaire
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Obtenir toutes les échelles
router.get('/', async (req, res) => {
  try {
    const scales = await Scale.findAll();
    res.json(scales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtenir une échelle par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const scale = await Scale.findByPk(id);
    if (scale) {
      res.json(scale);
    } else {
      res.status(404).json({ error: 'Scale not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Créer une nouvelle échelle
router.post('/', async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newScale = await Scale.create({ /* assign values to model attributes */ });
    res.json(newScale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mettre à jour une échelle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const scale = await Scale.findByPk(id);
    if (scale) {
      await scale.update({ /* assign updated values to model attributes */ });
      res.json(scale);
    } else {
      res.status(404).json({ error: 'Scale not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Supprimer une échelle
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const scale = await Scale.findByPk(id);
    if (scale) {
      await scale.destroy();
      res.json({ message: 'Scale deleted successfully' });
    } else {
      res.status(404).json({ error: 'Scale not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export du routeur
module.exports = router;
