const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Models = require('../models');
const express = require('express');
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Afficher le formulaire de modification de mot de passe
router.get('/', async (req, res) => {
  try {
    const errors = validationResult(req);
    res.json({
      users: req.decoded,
      title: 'Password',
      is_admin: req.decoded.is_admin,
      errors: errors.array(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Gérer la soumission du formulaire pour mettre à jour le mot de passe
router.post('/', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        users: req.decoded,
        title: 'Password',
        is_admin: req.decoded.is_admin,
        errors: errors.array(),
      });
    }

    const { password, confirmPassword } = req.body;

    // Vérifiez si les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    // Générer un sel et hacher le nouveau mot de passe avec bcrypt
    const saltRounds = 10; // Vous pouvez ajuster le nombre de tours selon vos besoins
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Mettez à jour le mot de passe dans la base de données
    await Models.User.update(
      { password: hashedPassword },
      { where: { id: req.decoded.id } }
    );

    // Mettez à jour la session avec les nouvelles données de l'utilisateur
    const updatedUserInstance = await Models.User.findOne({
      where: {
        id: req.decoded.id,
      },
    });

    // Supposons que vous ayez un message de réussite ou une logique de redirection
    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
