'use strict';
const { DataTypes } = require('sequelize');
module.exports = sequelize => {
  var groups = sequelize.define(
    'groups',
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

  groups.associate = models => {
    groups.hasMany(models.users, {foreignKey: 'group_id'});
  };
  return groups;
};
