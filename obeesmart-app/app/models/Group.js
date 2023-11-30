'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  Group.associate = models => {
    Group.hasMany(models.User, { foreignKey: 'group_id' });
  };

  return Group;
};