'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

const bcrypt = require('bcrypt');
module.exports = sequelize => {
  const User = sequelize.define(
    'User',
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
      is_admin: DataTypes.BOOLEAN,
      role: DataTypes.ENUM('enable', 'disabled'),
      authtype: DataTypes.ENUM('local', 'ldap'),
      contact_tel: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  User.associate = models => {
    User.hasMany(models.CentraleHarpes, {foreignKey: 'user_id'});
    User.hasMany(models.Harpe, {foreignKey: 'user_id'});
    User.hasMany(models.Ruche, {foreignKey: 'user_id'});
    User.hasMany(models.Screen, {foreignKey: 'user_id'});
    User.hasMany(models.Scale, {foreignKey: 'user_id'});
    User.hasMany(models.Log, {foreignKey: 'user_id'});
  };

  User.beforeUpdate(User => {
    const salt = bcrypt.genSaltSync();
    User.password = bcrypt.hashSync(User.password, salt);
  });

  User.beforeCreate(User => {
    const salt = bcrypt.genSaltSync();
    User.password = bcrypt.hashSync(User.password, salt);
  });

  User.prototype.isEnable = function() {
    if (this.role === 'enable') {
      return true;
    } else {
      return false;
    }
  };

  User.prototype.validPassword = function(password) {
    if (config.ldap_enable) {
      console.log('LDAP Auth');
      return bcrypt.compareSync(password, this.password);
    } else {
      console.log('Local Auth');
      return bcrypt.compareSync(password, this.password);
    }
  };

  return User;
};
