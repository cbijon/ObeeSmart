const express = require('express');
const { CentraleHarpes } = require('../models');
const router = express.Router();


const logAction = async (action, user_id, details) => {
  try {
    await Models.Log.create({
      action,
      user_id,
      details,
    });
  } catch (error) {
    console.error('Error logging action:', error);
    // Handle the error as needed
  }
};
// Usage
// logAction('User Login', userId, { ipAddress: '127.0.0.1' });
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

// Obtenir toutes les centrales harpes
router.get('/', async (req, res) => {
  try {
    const centraleHarpes = await CentraleHarpes.findAll();
    res.json(centraleHarpes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtenir une centrale harpe par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const centraleHarpe = await CentraleHarpes.findByPk(id);
    if (centraleHarpe) {
      res.json(centraleHarpe);
    } else {
      res.status(404).json({ error: 'CentraleHarpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Créer une nouvelle centrale harpe
router.post('/', async (req, res) => {
  try {
    const newCentraleHarpe = await CentraleHarpes.create(req.body);
    res.json(newCentraleHarpe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mettre à jour une centrale harpe
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const centraleHarpe = await CentraleHarpes.findByPk(id);
    if (centraleHarpe) {
      await centraleHarpe.update(req.body);
      res.json(centraleHarpe);
    } else {
      res.status(404).json({ error: 'CentraleHarpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Supprimer une centrale harpe
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const centraleHarpe = await CentraleHarpes.findByPk(id);
    if (centraleHarpe) {
      await centraleHarpe.destroy();
      res.json({ message: 'CentraleHarpe deleted successfully' });
    } else {
      res.status(404).json({ error: 'CentraleHarpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
