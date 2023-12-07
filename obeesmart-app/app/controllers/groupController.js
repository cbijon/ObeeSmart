"use strict";
const Models = require("../models");
const express = require("express");
const router = express.Router();

// Middleware de vérification de session
const checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next(); // Si la session existe, continuez
  } else {
    res.redirect("/login"); // Sinon, redirigez vers la page de connexion
  }
};

// Appliquer le middleware à toutes les routes
router.use(checkSession);

exports.manageGroups = (req, res) => {
  if (req.session.user.is_admin) {
    Models.Group.findAll({
      attributes: ["id", "name"],
    }).then(function (Group) {
      res.render("groups", {
        title: "Gestion des groupes",
        groups: Group,
        is_admin: req.session.user.is_admin,
      });
    });
  } else {
    res.redirect("/login");
  }
};

exports.createGroup = async (req, res) => {
  if (req.session.user.is_admin) {
    Models.Group.create({
      name: req.body.name,
    }).then(function () {
      res.redirect("/groups");
    });
  } else {
    res.redirect("/login");
  }
};

exports.destroyGroup = async (req, res) => {
  if (req.session.user.is_admin) {
    Models.Group.destroy({
      where: {
        id: req.params.group_id,
      },
    }).then(function () {
      res.redirect("/groups");
    });
  } else {
    res.redirect("/login");
  }
};

exports.editGroup = async (req, res) => {
  if (req.session.user.is_admin) {
    Models.Group.findOne({
      where: { id: req.params.group_id },
    }).then(function (Group) {
      res.render("groups_edit", {
        title: "Edition groupe",
        groups: Group,
        is_admin: req.session.user.is_admin,
      });
    });
  } else {
    res.redirect("/login");
  }
};

exports.updateGroup = async (req, res) => {
  if (req.session.user.is_admin) {
    Models.Group
      .update(
        {
          name: req.body.name,
        },
        {
          where: { id: req.params.group_id },
        }
      )
      .then(function () {
        res.redirect("/groups");
      });
  } else {
    res.redirect("/login");
  }
};

module.exports = router;
