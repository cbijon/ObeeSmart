'use strict';
const express = require('express');
const Models = require('../models');
const asyncHandler = require('express-async-handler');

const router = express.Router();

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

// Gérer l'affichage des groupes
router.get('/', asyncHandler(async (req, res) => {
  if (req.session.user.is_admin) {
    const groups = await Models.Group.findAll({
      attributes: ['id', 'name'],
    });
    res.render('groups', {
      title: 'Gestion des groupes',
      groups,
      is_admin: req.session.user.is_admin,
    });
  } else {
    res.redirect('/login');
  }
}));

// Gérer la création d'un groupe
router.post('/', asyncHandler(async (req, res) => {
  if (req.session.user.is_admin) {
    await Models.Group.create({
      name: req.body.name,
    });
    res.redirect('/groups');
  } else {
    res.redirect('/login');
  }
}));

// Gérer la suppression d'un groupe
router.delete('/:group_id', asyncHandler(async (req, res) => {
  if (req.session.user.is_admin) {
    await Models.Group.destroy({
      where: {
        id: req.params.group_id,
      },
    });
    res.redirect('/groups');
  } else {
    res.redirect('/login');
  }
}));

// Gérer l'édition d'un groupe
router.get('/:group_id/edit', asyncHandler(async (req, res) => {
  if (req.session.user.is_admin) {
    const group = await Models.Group.findOne({
      where: { id: req.params.group_id },
    });
    res.render('groups_edit', {
      title: 'Edition groupe',
      group,
      is_admin: req.session.user.is_admin,
    });
  } else {
    res.redirect('/login');
  }
}));

// Gérer la mise à jour d'un groupe
router.post('/:group_id/update', asyncHandler(async (req, res) => {
  if (req.session.user.is_admin) {
    await Models.Group.update(
      { name: req.body.name },
      { where: { id: req.params.group_id } }
    );
    res.redirect('/groups');
  } else {
    res.redirect('/login');
  }
}));

router.get('/:group_id/destroy', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.Group
      .destroy({
        where: {
          id: req.params.group_id,
        },
      })
      .then(function() {
        res.redirect('/groups');
      });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
