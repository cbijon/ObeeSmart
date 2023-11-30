// controllers/scaleController.js
const { Scale } = require('../models');

const getAllScales = async (req, res) => {
  try {
    const scales = await Scale.findAll();
    res.json(scales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getScaleById = async (req, res) => {
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
};

const createScale = async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newScale = await Scale.create({ /* assign values to model attributes */ });
    res.json(newScale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateScale = async (req, res) => {
  const { id } = req.params;
  const { /* extract fields to update from request body */ } = req.body;
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
};

const deleteScale = async (req, res) => {
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
};

module.exports = {
  getAllScales,
  getScaleById,
  createScale,
  updateScale,
  deleteScale,
};
