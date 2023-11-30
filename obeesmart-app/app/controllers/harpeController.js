// controllers/harpeController.js
const { Harpe } = require('../models');

const getAllHarpes = async (req, res) => {
  try {
    const harpes = await Harpe.findAll();
    res.json(harpes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHarpeById = async (req, res) => {
  const { id } = req.params;
  try {
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      res.json(harpe);
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createHarpe = async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newHarpe = await Harpe.create({ /* assign values to model attributes */ });
    res.json(newHarpe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateHarpe = async (req, res) => {
  const { id } = req.params;
  const { /* extract fields to update from request body */ } = req.body;
  try {
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      await harpe.update({ /* assign updated values to model attributes */ });
      res.json(harpe);
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteHarpe = async (req, res) => {
  const { id } = req.params;
  try {
    const harpe = await Harpe.findByPk(id);
    if (harpe) {
      await harpe.destroy();
      res.json({ message: 'Harpe deleted successfully' });
    } else {
      res.status(404).json({ error: 'Harpe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllHarpes,
  getHarpeById,
  createHarpe,
  updateHarpe,
  deleteHarpe,
};
