const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Models = require('../models');
const randomstring = require('randomstring');

const router = express.Router();

// Obtenir tous les utilisateurs
router.getAllUser = async (req, res) => {
  console.log(req.session.user);
  console.log(req.cookies.user_sid);
  if (req.session && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.findAll({
      attributes: [
        'id',
        'firstname',
        'lastname',
        'email',
        'is_admin',
        'group_id',
        'role',
      ],
      order: [['lastname', 'ASC']],
    }).then(function (User) {
      Models.Group.findAll({
        attributes: ['id', 'name'],
      }).then(function (Group) {
        res.render('users', {
          title: 'Gestion des utilisateurs',
          users: User,
          groups: Group,
          is_admin: req.session.user.is_admin,
        });
      });
    });
  } else {
    res.redirect('/login');
  }
};

// Obtenir un utilisateur par ID
router.getUserById = async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.findOne({
      where: { id: req.params.userId },
    }).then(function (User) {
      Models.Group.findAll().then(function (Group) {
        res.render('users_edit', {
          title: 'Edition utilisateur',
          users: User,
          groups: Group,
          is_admin: req.session.user.is_admin,
        });
      });
    });
  } else {
    res.redirect('/login');
  }
};

// Créer un nouvel utilisateur
router.createUser = async (req, res) => {
  try {
    // Validation des données du formulaire
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Génération du sel pour le hachage
    const salt = await bcrypt.genSalt(10);

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Création de l'utilisateur dans la base de données
    const newUser = await Models.User.create({
      login: req.body.login,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword, // Utilisation du mot de passe haché
      group_id: req.body.group_id,
      is_admin: req.body.is_admin,
      contact_tel: req.body.contact_tel,
    });

    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Mettre à jour un utilisateur
router.updateUser = async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.update(
      {
        login: req.body.login,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        group_id: req.body.group_id,
        is_admin: req.body.is_admin,
        contact_tel: req.body.contact_tel,
      },
      {
        where: { id: req.params.userId },
      }
    ).then(function () {
      res.redirect('/users');
    });
  } else {
    res.redirect('/login');
  }
};

// Supprimer un utilisateur
router.deleteUser = async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.destroy({
      where: {
        id: req.params.userId,
      },
    }).then(function () {
      res.redirect('/users');
    });
  } else {
    res.redirect('/login');
  }
};

// Activer un utilisateur
router.enableUser = async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.update(
      {
        role: 'enable',
      },
      {
        where: { id: req.params.userId },
      }
    ).then(function () {
      res.redirect('/users');
    });
  } else {
    res.redirect('/login');
  }
};

// Désactiver un utilisateur
router.disableUser = async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.User.update(
      {
        role: 'disabled',
      },
      {
        where: { id: req.params.userId },
      }
    ).then(function () {
      res.redirect('/users');
    });
  } else {
    res.redirect('/login');
  }
};

router.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const User = await Models.User.findOne({
      where: {
        email: email,
      },
    });

    if (!User) {
      console.log('Invalid email');
      return res.redirect('/login');
    }

    if (!User.isEnable()) {
      console.log('User disabled');
      return res.redirect('/login');
    }

    if (!User.validPassword(password)) {
      console.log('Invalid password');
      return res.redirect('/login');
    }

    console.log('Login successful');
    req.session.user = User.dataValues;
    console.log(req.session.user);
    res.cookie('user_sid', randomstring.generate(), { maxAge: 10800 });
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    return res.redirect('/login');
  }
};

router.logoutUser = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    req.session.destroy();
    res.redirect('/');
    console.log('Logout successful');
  } else {
    res.redirect('/login');
  }
};

// Export du routeur
module.exports = router;
