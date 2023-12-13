const express = require('express');
const { Screen } = require('../models'); // Ajustez le chemin si nécessaire
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Obtenir tous les écrans
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.findAll();
    res.json(screens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtenir un écran par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const screen = await Screen.findByPk(id);
    if (screen) {
      res.json(screen);
    } else {
      res.status(404).json({ error: 'Screen not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Créer un nouvel écran
router.post('/', async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newScreen = await Screen.create({ /* assign values to model attributes */ });
    res.json(newScreen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mettre à jour un écran
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const screen = await Screen.findByPk(id);
    if (screen) {
      await screen.update({ /* assign updated values to model attributes */ });
      res.json(screen);
    } else {
      res.status(404).json({ error: 'Screen not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Supprimer un écran
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const screen = await Screen.findByPk(id);
    if (screen) {
      await screen.destroy();
      res.json({ message: 'Screen deleted successfully' });
    } else {
      res.status(404).json({ error: 'Screen not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export du routeur
module.exports = router;
