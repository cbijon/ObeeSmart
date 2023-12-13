'use strict';
const express = require('express');
const Models = require('../models');
const asyncHandler = require('express-async-handler');
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Gérer l'affichage des groupes
router.get('/', asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      const groups = await Models.Group.findAll({
        attributes: ['id', 'name'],
      });
      res.json({
        title: 'Gestion des groupes',
        groups,
        is_admin: req.decoded.is_admin,
      });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Gérer la création d'un groupe
router.post('/', asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.Group.create({
        name: req.body.name,
      });
      res.json({ message: 'Group created successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Gérer la suppression d'un groupe
router.delete('/:group_id', asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.Group.destroy({
        where: {
          id: req.params.group_id,
        },
      });
      res.json({ message: 'Group deleted successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Gérer l'édition d'un groupe
router.get('/:group_id/edit', asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      const group = await Models.Group.findOne({
        where: { id: req.params.group_id },
      });
      res.json({
        title: 'Edition groupe',
        group,
        is_admin: req.decoded.is_admin,
      });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Gérer la mise à jour d'un groupe
router.put('/:group_id', asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.Group.update(
        { name: req.body.name },
        { where: { id: req.params.group_id } }
      );
      res.json({ message: 'Group updated successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

module.exports = router;
