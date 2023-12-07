const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Ajoutez ces routes pour gérer la modification du mot de passe
router.get('/password', passwordController.showPasswordForm);
router.post('/updatepassword', passwordController.updatePassword);

// ...

// Exportez le router pour pouvoir l'utiliser dans d'autres fichiers
module.exports = router;