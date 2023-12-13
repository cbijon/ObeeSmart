const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Models = require('../models'); // Ajustez le chemin au besoin
const express = require('express');
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

// Afficher le formulaire de modification de mot de passe
router.get('/', async (req, res) => {
  const errors = validationResult(req);
  res.render('password', {
    users: req.session.user,
    title: 'Password',
    is_admin: req.session.user.is_admin,
    errors: errors.array(),
  });
});

// Gérer la soumission du formulaire pour mettre à jour le mot de passe
router.post('/', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('password', {
      users: req.session.user,
      title: 'Password',
      is_admin: req.session.user.is_admin,
      errors: errors.array(),
    });
  }

  try {
    const { password, confirmPassword } = req.body;

    // Vérifiez si les mots de passe correspondent
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    // Générer un sel et hacher le nouveau mot de passe avec bcrypt
    const saltRounds = 10; // Vous pouvez ajuster le nombre de tours selon vos besoins
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Mettez à jour le mot de passe dans la base de données
    const updatedUser = await Models.User.update(
      { password: hashedPassword },
      { where: { id: req.session.user.id } }
    );

    // Mettez à jour la session avec les nouvelles données de l'utilisateur
    const updatedUserInstance = await Models.User.findOne({
      where: {
        id: req.session.user.id,
      },
    });
    req.session.user = updatedUserInstance.dataValues;

    // Supposons que vous ayez un message de réussite ou une logique de redirection
    res.redirect('/password'); // Redirigez vers une page de réussite ou le tableau de bord
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur interne du serveur');
  }
});

module.exports = router;
