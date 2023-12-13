const express = require('express');
const { validationResult } = require('express-validator');
const Models = require('../models'); // Ajustez le chemin si nécessaire
const verifyToken = require('../middleware/verifyToken'); // Add this line for token verification

const router = express.Router();

// Middleware de vérification du token
router.use(verifyToken);

// Afficher le formulaire de modification des préférences utilisateur
router.get('/', (req, res) => {
  try {
    const errors = validationResult(req);
    res.json({
      users: req.decoded,
      title: 'Preferences',
      is_admin: req.decoded.is_admin,
      errors: errors.array(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Gérer la soumission du formulaire pour mettre à jour les préférences utilisateur
router.post('/', async (req, res) => {
  try {
    // Valider les données du formulaire en utilisant express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // S'il y a des erreurs de validation, réafficher le formulaire avec des messages d'erreur
      return res.json({
        users: req.decoded,
        title: 'Preferences',
        is_admin: req.decoded.is_admin,
        errors: errors.array(),
      });
    }

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
        where: { id: req.decoded.id }, // Utiliser l'ID de l'utilisateur à partir du token
      }
    );

    const User = await Models.User.findOne({
      where: {
        email: req.body.email,
      },
    });

    req.decoded = User.dataValues;
    // Supposons que vous ayez un message de réussite ou une logique de redirection
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export du routeur
module.exports = router;
