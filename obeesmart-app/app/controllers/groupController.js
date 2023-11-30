'use strict';
const Models = require('../models');
const express = require('express');
const router = express.Router();

exports.manageGroups = (req, res) => {
  if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
    Models.Group.findAll({
      attributes: ['id', 'name'],
    })
      .then(function(groups) {
        res.render('groups', {
          title: 'Gestion des groupes',
          groups: groups,
          is_manager: req.session.user.is_manager,
          is_admin: req.session.user.is_admin,
        });
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
        res.status(500).send('Internal Server Error');
      });
  } else {
    res.redirect('/login');
  }
};

exports.createGroup = async (req, res) => {
  try {
    if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
      const { name } = req.body;
      const newGroup = await Models.Group.create({ name });

      res.redirect('/groups');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.destroyGroup = async (req, res) => {
  try {
    if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
      const groupId = req.params.group_id;
      await Models.Group.destroy({ where: { id: groupId } });

      res.redirect('/groups');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.editGroup = async (req, res) => {
  try {
    if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
      const groupId = req.params.group_id;
      const group = await Models.Group.findByPk(groupId);

      res.render('groups_edit', {
        title: 'Edition groupe',
        group: group,
        is_manager: req.session.user.is_manager,
        is_admin: req.session.user.is_admin,
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error editing group:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateGroup = async (req, res) => {
  try {
    if (req.session.user && req.cookies.user_sid && req.session.user.is_admin) {
      const groupId = req.params.group_id;
      const { name } = req.body;

      await Models.Group.update({ name }, { where: { id: groupId } });

      res.redirect('/groups');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).send('Internal Server Error');
  }
};