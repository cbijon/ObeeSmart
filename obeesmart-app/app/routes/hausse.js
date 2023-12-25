const express = require("express");
const asyncHandler = require("express-async-handler");
//const fetch = require("node-fetch"); // Assurez-vous d'installer le module node-fetch
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const Models = require("../models");

const router = express.Router();

// Middleware de vérification de session
const checkSession = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next(); // If the session exists, continue
    } else {
        //res.status(401).json({ message: "Unauthorized: Session not found" });
        res.redirect('/login');
    }
};

// Obtenir toutes les hausses
router.get('/', checkSession, asyncHandler(async (req, res) => {
    const hausses = await Models.Hausse.findAll();
    const ruches = await Models.Ruche.findAll(); // Ajoutez cette ligne pour obtenir la liste des ruches
    res.render('hausses', { hausses: hausses, ruches: ruches });
}));

// Créer une nouvelle hausse
router.post('/create', checkSession, asyncHandler(async (req, res) => {
    const newHausse = await Models.Hausse.create(req.body);
    res.redirect('/hausses');
}));

module.exports = router;
