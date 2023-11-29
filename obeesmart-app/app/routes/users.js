'use strict';
const bcrypt = require('bcrypt');
const express = require('express');
const Models = require('../models');
const router = express.Router();

// NORMAL MODE
// route for manage profil
router.get('/preferences', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    Models.users
      .findOne({
        where: {
          id: req.session.user.id,
        },
      })
      .then(function(users) {
        res.render('preferences', {
          title: 'Gestion de mon profil',
          users: users,
          is_manager: req.session.user.is_manager,
          is_admin: req.session.user.is_admin,
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/updatepref', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(req.body.password, salt);
    Models.users
      .update(
        {
          login: req.body.login,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: password,
        },
        {
          where: {
            id: req.session.user.id,
          },
        }
      )
      .then(function() {
        res.redirect('/preferences');
      });
  } else {
    res.redirect('/login');
  }
});

// ADMIN MODE
// route to manage users
router.get('/', (req, res) => {
  if (req.session && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .findAll({
        attributes: [
          'id',
          'firstname',
          'lastname',
          'email',
          'is_manager',
          'is_admin',
          'group_id',
          'role',
        ],
        order: [['lastname', 'ASC']],
      })
      .then(function(users) {
        Models.groups
          .findAll({
            attributes: ['id', 'name'],
          })
          .then(function(groups) {
            Models.users
              .findAll({
                attributes: ['id', 'login'],
                where: {
                  is_manager: true,
                },
              })
              .then(function(managers) {
                res.render('users', {
                  title: 'Gestion des utilisateurs',
                  users: users,
                  groups: groups,
                  managers: managers,
                  is_manager: req.session.user.is_manager,
                  is_admin: req.session.user.is_admin,
                });
              });
          });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/create', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .create({
        login: req.body.login,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        manager_id: req.body.manager_id,
        group_id: req.body.group_id,
        is_manager: req.body.is_manager,
        is_admin: req.body.is_admin,
        contact_tel: req.body.contact_tel,
      })
      .then(function() {
        res.redirect('/users');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/:users_id/destroy', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .destroy({
        where: {
          id: req.params.users_id,
        },
      })
      .then(function() {
        res.redirect('/users');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/:users_id/enable', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .update(
        {
          role: 'enable',
        },
        {
          where: {id: req.params.users_id},
        }
      )
      .then(function() {
        res.redirect('/users');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/:users_id/disable', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .update(
        {
          role: 'disabled',
        },
        {
          where: {id: req.params.users_id},
        }
      )
      .then(function() {
        res.redirect('/users');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/:users_id/edit', (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .findOne({
        where: {id: req.params.users_id},
      })
      .then(function(users) {
        Models.groups
          .findAll()
          .then(function(groups) {
            // console.log("groups "+groups),
            Models.users
              .findAll({
                attributes: ['id', 'login'],
                where: {
                  is_manager: true,
                },
              })
              .then(function(managers) {
                // console.log(users.login),
                res.render('users_edit', {
                  title: 'Edition utilisateur',
                  users: users,
                  groups: groups,
                  managers: managers,
                  is_manager: req.session.user.is_manager,
                  is_admin: req.session.user.is_admin,
                });
              });
          });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/:users_id/update', function(req, res) {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.users
      .update(
        {
          login: req.body.login,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          manager_id: req.body.manager_id,
          group_id: req.body.group_id,
          is_admin: req.body.is_admin,
          is_manager: req.body.is_manager,
          contact_tel: req.body.contact_tel,
        },
        {
          where: {id: req.params.users_id},
        }
      )
      .then(function() {
        res.redirect('/users');
      });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
