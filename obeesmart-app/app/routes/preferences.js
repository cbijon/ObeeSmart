const express = require('express');
const { validationResult } = require('express-validator');
const Models = require('../models'); // Ajustez le chemin si nécessaire

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

// Afficher le formulaire de modification des préférences utilisateur
router.get('/', (req, res) => {
  // Supposons que vous ayez une variable 'user' disponible dans votre session
  // const user = req.session.user;
  const errors = validationResult(req);
  res.render('preferences', {
    users: req.session.user,
    title: 'Preferences',
    is_admin: req.session.user.is_admin,
  });
});

// Gérer la soumission du formulaire pour mettre à jour les préférences utilisateur
router.post('/updatepref', async (req, res) => {
  // Valider les données du formulaire en utilisant express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // S'il y a des erreurs de validation, réafficher le formulaire avec des messages d'erreur
    return res.render('preferences', {
      users: req.session.user,
      title: 'Preferences',
      is_admin: req.session.user.is_admin,
    });
  }

  try {
    // Mettre à jour les préférences utilisateur dans la base de données
    const updatedUser = await Models.User.update(
      {
        login: req.body.login,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        contact_tel: req.body.contact_tel,
        // Ajouter d'autres champs au besoin
      },
      {
        where: { id: req.session.user.id }, // Supposons que l'ID de l'utilisateur soit stocké dans la session
      }
    );

    const User = await Models.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    req.session.user = User.dataValues;
    // Supposons que vous ayez un message de réussite ou une logique de redirection
    res.redirect('/preferences'); // Rediriger vers une page de réussite ou le tableau de bord
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Export du routeur
module.exports = router;
