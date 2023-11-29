'use strict';
// var path = require('path');
// var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
var config = require(__dirname + '/../config/config.js')[env];

var bcrypt = require('bcrypt');
module.exports = sequelize => {
  var users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      login: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      manager_id: DataTypes.UUID,
      is_manager: DataTypes.BOOLEAN,
      is_admin: DataTypes.BOOLEAN,
      role: DataTypes.ENUM('enable', 'disabled'),
      authtype: DataTypes.ENUM('local', 'ldap'),
      contact_tel: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
/*
  users.associate = models => {
    users.hasMany(models.observations, {foreignKey: 'users_id'});
    users.hasMany(models.commentaires, {foreignKey: 'users_id'});
    users.hasMany(models.sounds, {foreignKey: 'users_id'});
    users.hasMany(models.birds, {foreignKey: 'users_id'});
    users.hasMany(models.locations, {foreignKey: 'users_id'});
    users.hasMany(models.photos, {foreignKey: 'users_id'});
  };
*/
  users.beforeUpdate(users => {
    const salt = bcrypt.genSaltSync();
    users.password = bcrypt.hashSync(users.password, salt);
  });

  users.beforeCreate(users => {
    const salt = bcrypt.genSaltSync();
    users.password = bcrypt.hashSync(users.password, salt);
  });

  users.prototype.isEnable = function() {
    if (this.role === 'enable') {
      return true;
    } else {
      return false;
    }
  };

  users.prototype.validPassword = function(password) {
    if (config.ldap_enable) {
      console.log('LDAP Auth');
      return bcrypt.compareSync(password, this.password);
    } else {
      console.log('Local Auth');
      return bcrypt.compareSync(password, this.password);
    }
  };

  return users;
};
