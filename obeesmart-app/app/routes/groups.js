'use strict';
// const session = require('express-session');
const Models = require('../models');
const express = require('express');
const router = express.Router();


// route to manage groups
router.get('/', (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.groups
      .findAll({
        attributes: ['id', 'name'],
      })
      .then(function(groups) {
        res.render('groups', {
          title: 'Gestion des groupes',
          groups: groups,
          is_manager: req.session.user.is_manager,
          is_admin: req.session.user.is_admin,
        });
      });
  } else {
    res.redirect('/login');
  }
});


router.post('/create', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.groups
      .create({
        name: req.body.name,
      })
      .then(function() {
        res.redirect('/groups');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/:group_id/destroy', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.groups
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

router.get('/:group_id/edit', (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.groups
      .findOne({
        where: {id: req.params.group_id},
      })
      .then(function(groups) {
        res.render('groups_edit', {
          title: 'Edition utilisateur',
          groups: groups,
          is_manager: req.session.user.is_manager,
          is_admin: req.session.user.is_admin,
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/:group_id/update', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.groups
      .update(
        {
          name: req.body.name,
        },
        {
          where: {id: req.params.group_id},
        }
      )
      .then(function() {
        res.redirect('/groups');
      });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
