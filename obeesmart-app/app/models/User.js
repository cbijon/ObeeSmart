'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

const bcrypt = require('bcrypt');
module.exports = sequelize => {
  const user = sequelize.define(
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

  user.associate = models => {
    user.hasMany(models.CentraleHarpes, {foreignKey: 'user_id'});
    user.hasMany(models.Harpe, {foreignKey: 'user_id'});
    user.hasMany(models.Ruche, {foreignKey: 'user_id'});
    user.hasMany(models.Screen, {foreignKey: 'user_id'});
    user.hasMany(models.Scale, {foreignKey: 'user_id'});
  };

  user.beforeUpdate(user => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  });

  user.beforeCreate(user => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  });

  user.prototype.isEnable = function() {
    if (this.role === 'enable') {
      return true;
    } else {
      return false;
    }
  };

  user.prototype.validPassword = function(password) {
    if (config.ldap_enable) {
      console.log('LDAP Auth');
      return bcrypt.compareSync(password, this.password);
    } else {
      console.log('Local Auth');
      return bcrypt.compareSync(password, this.password);
    }
  };

  return user;
};
