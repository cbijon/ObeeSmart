const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Models = require('../models');
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

// Appliquer le middleware à toutes les routes
router.use(checkSession);

// Générer un nouveau token
router.post('/generate', asyncHandler(async (req, res) => {
  const { userId, expiresIn } = req.body;
  const token = uuidv4();
  const expires = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

  const createdToken = await Models.Token.create({
    token,
    userId,
    expires,
  });

  res.json({ token: createdToken.token });
}));

// Valider un token
router.get('/validate/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;

  const foundToken = await Models.Token.findOne({
    where: { token },
  });

  if (foundToken && (!foundToken.expires || foundToken.expires > new Date())) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
}));

// Supprimer un token
router.delete('/delete/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;

  await Models.Token.destroy({
    where: { token },
  });

  res.json({ success: true });
}));

// Export du routeur
module.exports = router;
