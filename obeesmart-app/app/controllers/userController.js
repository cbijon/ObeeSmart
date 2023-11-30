// controllers/userController.js
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Models = require('../models');
const randomstring = require('randomstring');

// Obtenir tous les utilisateurs
exports.getAllUser = async (req, res) => {
  try {
    const user = await Models.user.findAll();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await Models.user.findByPk(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = await Models.user.create({
      login: req.body.login,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      manager_id: req.body.manager_id,
      group_id: req.body.group_id,
      is_manager: req.body.is_manager,
      is_admin: req.body.is_admin,
      contact_tel: req.body.contact_tel,
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await Models.user.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await user.update({
      login: req.body.login,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      manager_id: req.body.manager_id,
      group_id: req.body.group_id,
      is_manager: req.body.is_manager,
      is_admin: req.body.is_admin,
      contact_tel: req.body.contact_tel,
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await Models.user.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    await user.destroy();
    res.send('Utilisateur supprimé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Activer un utilisateur
exports.enableUser = async (req, res) => {
  try {
    const user = await Models.user.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    await user.update({
      role: 'enable',
    });

    res.send('Utilisateur activé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Désactiver un utilisateur
exports.disableUser = async (req, res) => {
  try {
    const user = await Models.user.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    await user.update({
      role: 'disabled',
    });

    res.send('Utilisateur désactivé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};



exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Models.user.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log('Invalid email');
      return res.redirect('/login');
    }

    if (!user.isEnable()) {
      console.log('User disabled');
      return res.redirect('/login');
    }

    if (!user.validPassword(password)) {
      console.log('Invalid password');
      return res.redirect('/login');
    }

    console.log('Login successful');
    req.session.user = user.dataValues;
    console.log(req.session.user);
    res.cookie('user_sid', randomstring.generate(), { maxAge: 10800 });
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    return res.redirect('/login');
  }
};

exports.logoutUser = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    req.session.destroy();
    res.redirect('/');
    console.log('Logout successful');
  } else {
    res.redirect('/login');
  }
};
