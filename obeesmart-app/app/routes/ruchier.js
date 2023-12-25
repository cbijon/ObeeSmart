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

// Obtenir tous les ruchiers
router.get('/', checkSession, asyncHandler(async (req, res) => {
    const ruchiers = await Models.Ruchier.findAll();
    res.render('ruchiers', { ruchiers: ruchiers });
}));

// Créer un nouveau ruchier
router.post('/create', checkSession, asyncHandler(async (req, res) => {
    const address = req.body.address;
    console.log(address);
    const coordinates = await getCoordinates(address);
    console.log(coordinates);
    // Assurez-vous de décomposer correctement l'adresse
    const addressDetails = await getAddressDetails(coordinates);
    console.log(addressDetails);
    // Créez le nouveau ruchier avec les détails d'adresse obtenus et les coordonnées
    const newRuchier = await Models.Ruchier.create({
        name: req.body.name,
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        streetname: addressDetails.street,
        postalcode: addressDetails.postalcode,
        city: addressDetails.city,
        country: addressDetails.country,
    });

    res.redirect('/ruchiers');
}));

// Obtenir un ruchier par ID
router.get('/:ruchierId', checkSession, asyncHandler(async (req, res) => {
    const ruchier = await Models.Ruchier.findOne({
        where: { id: req.params.ruchierId },
    });
    res.render('ruchier_details', { ruchier: ruchier });
}));

// Fonction pour obtenir les coordonnées à partir de l'adresse
async function getCoordinates(address) {
    console.log(address);
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`);
    const data = await response.json();

    if (data.length > 0) {
        return { longitude: data[0].lon, latitude: data[0].lat };
    } else {
        throw new Error('Adresse non trouvée');
    }
}

// Fonction pour obtenir les détails d'adresse à partir des coordonnées
async function getAddressDetails(coordinates) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${coordinates.longitude}&lat=${coordinates.latitude}`);
    const data = await response.json();

    if (data.address) {
        return {
            street: data.address.road || '',
            postalcode: data.address.postcode || '',
            city: data.address.city || data.address.town || '',
            country: data.address.country || '',
        };
    } else {
        throw new Error('Détails d\'adresse non trouvés');
    }
}

module.exports = router;
