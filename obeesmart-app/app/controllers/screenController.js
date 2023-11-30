// controllers/screenController.js
const { Screen } = require('../models');

const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll();
    res.json(screens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getScreenById = async (req, res) => {
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
};

const createScreen = async (req, res) => {
  const { /* extract required fields from request body */ } = req.body;
  try {
    const newScreen = await Screen.create({ /* assign values to model attributes */ });
    res.json(newScreen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateScreen = async (req, res) => {
  const { id } = req.params;
  const { /* extract fields to update from request body */ } = req.body;
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
};

const deleteScreen = async (req, res) => {
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
};

module.exports = {
  getAllScreens,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen,
};
