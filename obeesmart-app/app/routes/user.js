const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Models = require('../models');
const randomstring = require('randomstring');
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

const logAction = async (action, user_id, details) => {
  try {
    await Models.Log.create({
      action,
      user_id,
      details,
    });
  } catch (error) {
    console.error('Error logging action:', error);
    // Handle the error as needed
  }
};
// Usage
// logAction('User Login', userId, { ipAddress: '127.0.0.1' });

// Appliquer le middleware à toutes les routes
router.use(checkSession);

// Obtenir tous les utilisateurs
router.get('/', asyncHandler(async (req, res) => {
  console.log(req.session.user);
  console.log(req.cookies.user_sid);
  if (req.session && req.cookies.user_sid && req.session.user.is_admin) {
    const users = await Models.User.findAll({
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
    });

    const groups = await Models.Group.findAll({
      attributes: ['id', 'name'],
    });

    res.render('users', {
      title: 'Gestion des utilisateurs',
      users: users,
      groups: groups,
      is_admin: req.session.user.is_admin,
    });
  } else {
    res.redirect('/login');
  }
}));

// Obtenir un utilisateur par ID
router.get('/:userId', asyncHandler(async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    const user = await Models.User.findOne({
      where: { id: req.params.userId },
    });

    const groups = await Models.Group.findAll();

    res.render('users_edit', {
      title: 'Edition utilisateur',
      users: user,
      groups: groups,
      is_admin: req.session.user.is_admin,
    });
  } else {
    res.redirect('/login');
  }
}));

// Créer un nouvel utilisateur
router.post('/createUser', asyncHandler(async (req, res) => {
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
}));

// Mettre à jour un utilisateur
router.put('/:userId/update', asyncHandler(async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    await Models.User.update(
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
    );

    res.redirect('/users');
  } else {
    res.redirect('/login');
  }
}));

// Supprimer un utilisateur
router.delete('/:userId/destroy', asyncHandler(async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    await Models.User.destroy({
      where: {
        id: req.params.userId,
      },
    });

    res.redirect('/users');
  } else {
    res.redirect('/login');
  }
}));

// Activer un utilisateur
router.put('/:userId/enable', asyncHandler(async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    await Models.User.update(
      {
        role: 'enable',
      },
      {
        where: { id: req.params.userId },
      }
    );

    res.redirect('/users');
  } else {
    res.redirect('/login');
  }
}));

// Désactiver un utilisateur
router.put('/:userId/disable', asyncHandler(async (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    await Models.User.update(
      {
        role: 'disabled',
      },
      {
        where: { id: req.params.userId },
      }
    );

    res.redirect('/users');
  } else {
    res.redirect('/login');
  }
}));



// Export du routeur
module.exports = router;
