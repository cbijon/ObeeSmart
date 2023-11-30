// controllers/rucheController.js
const { Ruche } = require('../models');

const getAllRuches = async (req, res) => {
  try {
    const ruches = await Ruche.findAll();
    res.json(ruches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRucheById = async (req, res) => {
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
};

const createRuche = async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newRuche = await Ruche.create({ /* assign values to model attributes */ });
    res.json(newRuche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateRuche = async (req, res) => {
  const { id } = req.params;
  const { /* extract fields to update from request body */ } = req.body;
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
};

const deleteRuche = async (req, res) => {
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
};

module.exports = {
  getAllRuches,
  getRucheById,
  createRuche,
  updateRuche,
  deleteRuche,
};
