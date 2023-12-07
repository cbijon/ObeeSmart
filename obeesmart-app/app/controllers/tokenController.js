const Models = require('../models');
const { v4: uuidv4 } = require('uuid');

// Middleware de vérification de session
const checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next(); // Si la session existe, continuez
  } else {
    res.redirect('/login'); // Sinon, redirigez vers la page de connexion
  }
};

exports.generateToken = async (req, res) => {
  try {
    const { userId, expiresIn } = req.body;
    const token = uuidv4();
    const expires = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    const createdToken = await Models.Token.create({
      token,
      userId,
      expires,
    });

    res.json({ token: createdToken.token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const { token } = req.params;

    const foundToken = await Models.Token.findOne({
      where: { token },
    });

    if (foundToken && (!foundToken.expires || foundToken.expires > new Date())) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const { token } = req.params;

    await Models.Token.destroy({
      where: { token },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export du middleware pour être utilisé dans d'autres fichiers de route
exports.checkSession = checkSession;
