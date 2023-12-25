const express = require("express");
const asyncHandler = require("express-async-handler");
const Models = require("../models");

const router = express.Router();

// Middleware de vérification de session
const checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next(); // Si la session existe, continuez
  } else {
    res.redirect('/login'); // Sinon, redirigez vers la page de connexion
  }
};

// Get all logs with optional user filter
router.get(
  "/",
  checkSession,
  asyncHandler(async (req, res) => {
    if (req.session && req.cookies.user_sid && req.session.user.is_admin) {
      try {
        const { user_id } = req.query;

        // Define a filter based on the presence of userId
        const filter = user_id ? { user_id } : {};

        const logs = await Models.Log.findAll({
          where: filter,
          include: Models.User, // Include the User model to get the user login
        });

        const users = await Models.User.findAll();

        // Render the logs using the renderer
        res.render("logs", {
          logs,
          users,
          is_admin: req.session.user.is_admin,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.redirect("/login");
    }
  })
);

// Export du routeur
module.exports = router;
