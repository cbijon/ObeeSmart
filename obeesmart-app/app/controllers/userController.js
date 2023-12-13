const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const asyncHandler = require('express-async-handler');
const Models = require('../models');
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();



// Obtenir tous les utilisateurs
router.get('/getAll', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
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

      res.json({
        title: 'Gestion des utilisateurs',
        users: users,
        groups: groups,
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

// Obtenir un utilisateur par ID
router.get('/getUserById/:userId', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      const user = await Models.User.findOne({
        where: { id: req.params.userId },
      });

      const groups = await Models.Group.findAll();

      res.json({
        title: 'Edition utilisateur',
        users: user,
        groups: groups,
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

// Créer un nouvel utilisateur
router.post('/createUser', verifyToken, asyncHandler(async (req, res) => {
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

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Mettre à jour un utilisateur
router.put('/updateUser/:userId', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
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

      res.json({ message: 'User updated successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Supprimer un utilisateur
router.delete('/deleteUser/:userId', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.User.destroy({
        where: {
          id: req.params.userId,
        },
      });

      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Activer un utilisateur
router.put('/enableUser/:userId', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.User.update(
        {
          role: 'enable',
        },
        {
          where: { id: req.params.userId },
        }
      );

      res.json({ message: 'User enabled successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Désactiver un utilisateur
router.put('/disableUser/:userId', verifyToken, asyncHandler(async (req, res) => {
  try {
    if (req.decoded.is_admin) {
      await Models.User.update(
        {
          role: 'disabled',
        },
        {
          where: { id: req.params.userId },
        }
      );

      res.json({ message: 'User disabled successfully' });
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Login utilisateur
router.post('/login', asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Models.User.findOne({
      where: {
        email: email,
      },
    });

    if (!user || !user.isEnable() || !user.validPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      'your_secret_key',
      { expiresIn: '1h' }
    );

    res.json({ token: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}));

// Logout utilisateur
router.get('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Export du routeur
module.exports = router;
