const express = require('express');
const { validationResult } = require('express-validator');
const { Ruche } = require('../models'); // Ajustez le chemin si nécessaire
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Obtenir toutes les ruches
router.get('/', async (req, res) => {
  try {
    const ruches = await Ruche.findAll();
    res.json(ruches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtenir une ruche par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ruche = await Ruche.findByPk(id);
    if (ruche) {
      res.json(ruche);
    } else {
      res.status(404).json({ error: 'Ruche not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Créer une nouvelle ruche
router.post('/', async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newRuche = await Ruche.create({ /* assign values to model attributes */ });
    res.json(newRuche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mettre à jour une ruche
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ruche = await Ruche.findByPk(id);
    if (ruche) {
      await ruche.update({ /* assign updated values to model attributes */ });
      res.json(ruche);
    } else {
      res.status(404).json({ error: 'Ruche not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Supprimer une ruche
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ruche = await Ruche.findByPk(id);
    if (ruche) {
      await ruche.destroy();
      res.json({ message: 'Ruche deleted successfully' });
    } else {
      res.status(404).json({ error: 'Ruche not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export du routeur
module.exports = router;
