// controllers/centraleHarpesController.js
const { CentraleHarpes } = require('../models');

const getAllCentraleHarpes = async (req, res) => {
  try {
    const centraleHarpes = await CentraleHarpes.findAll();
    res.json(centraleHarpes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCentraleHarpesById = async (req, res) => {
  const { id } = req.params;
  try {
    const centraleHarpes = await CentraleHarpes.findByPk(id);
    if (centraleHarpes) {
      res.json(centraleHarpes);
    } else {
      res.status(404).json({ error: 'CentraleHarpes not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createCentraleHarpes = async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newCentraleHarpes = await CentraleHarpes.create({ /* assign values to model attributes */ });
    res.json(newCentraleHarpes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateCentraleHarpes = async (req, res) => {
  const { id } = req.params;
  const { /* extract fields to update from request body */ } = req.body;
  try {
    const centraleHarpes = await CentraleHarpes.findByPk(id);
    if (centraleHarpes) {
      await centraleHarpes.update({ /* assign updated values to model attributes */ });
      res.json(centraleHarpes);
    } else {
      res.status(404).json({ error: 'CentraleHarpes not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCentraleHarpes = async (req, res) => {
  const { id } = req.params;
  try {
    const centraleHarpes = await CentraleHarpes.findByPk(id);
    if (centraleHarpes) {
      await centraleHarpes.destroy();
      res.json({ message: 'CentraleHarpes deleted successfully' });
    } else {
      res.status(404).json({ error: 'CentraleHarpes not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCentraleHarpes,
  getCentraleHarpesById,
  createCentraleHarpes,
  updateCentraleHarpes,
  deleteCentraleHarpes,
};
