const express = require('express');
const { CentraleHarpes } = require('../models');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Obtenir toutes les centrales harpes
router.get('/', asyncHandler(async (req, res) => {
  const centraleHarpes = await CentraleHarpes.findAll();
  res.json(centraleHarpes);
}));

// Obtenir une centrale harpe par ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const centraleHarpe = await CentraleHarpes.findByPk(id);
  if (centraleHarpe) {
    res.json(centraleHarpe);
  } else {
    res.status(404).json({ error: 'CentraleHarpe not found' });
  }
}));

// Créer une nouvelle centrale harpe
router.post('/', asyncHandler(async (req, res) => {
  const newCentraleHarpe = await CentraleHarpes.create(req.body);
  res.json(newCentraleHarpe);
}));

// Mettre à jour une centrale harpe
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const centraleHarpe = await CentraleHarpes.findByPk(id);
  if (centraleHarpe) {
    await centraleHarpe.update(req.body);
    res.json(centraleHarpe);
  } else {
    res.status(404).json({ error: 'CentraleHarpe not found' });
  }
}));

// Supprimer une centrale harpe
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const centraleHarpe = await CentraleHarpes.findByPk(id);
  if (centraleHarpe) {
    await centraleHarpe.destroy();
    res.json({ message: 'CentraleHarpe deleted successfully' });
  } else {
    res.status(404).json({ error: 'CentraleHarpe not found' });
  }
}));

module.exports = router;
