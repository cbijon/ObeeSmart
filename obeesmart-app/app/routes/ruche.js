const express = require("express");
const asyncHandler = require("express-async-handler");
const Models = require("../models");

const router = express.Router();

// Middleware de vérification de session
const checkSession = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next(); // If the session exists, continue
    } else {
        res.status(401).json({ message: "Unauthorized: Session not found" });
    }
};

// Obtenir toutes les ruches
router.get('/', checkSession, asyncHandler(async (req, res) => {
    const ruches = await Models.Ruche.findAll({
        include: [
            {
                model: Models.Hausse,
            },
        ],
    });
    res.render('ruches', { ruches: ruches });
}));

// Créer une nouvelle ruche
router.post('/create', checkSession, asyncHandler(async (req, res) => {
    const { name, baseWeight, isTare, Ruchier_id } = req.body;

    // Assurez-vous d'ajuster la création de la ruche en fonction de votre modèle
    const newRuche = await Models.Ruche.create({
        name: name,
        baseWeight: baseWeight,
        isTare: isTare,
        Ruchier_id: Ruchier_id,
        user_id: req.session.user.id, // Ajoutez l'ID de l'utilisateur connecté
    });

    res.redirect('/ruches');
}));

module.exports = router;
