'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = (sequelize) => {
  const Screen = sequelize.define(
    "Screen",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      // Ajoutez d'autres attributs du screen selon vos besoins
    },
    {
      underscored: true,
    }
  );

  Screen.associate = (models) => {
    Screen.hasMany(models.CentraleHarpes, { foreignKey: "Screen_id" });
    Screen.hasMany(models.Scale, { foreignKey: "Screen_id" });
    Screen.hasMany(models.Ruche, { foreignKey: "Screen_id" });
    
    /*
      Screen.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      Screen.hasMany(models.Ruche, {
        foreignKey: 'screen_id',
        onDelete: 'CASCADE',
      });
      Screen.hasOne(models.CentraleHarpes, {
        foreignKey: 'screen_id',
        onDelete: 'CASCADE',
      });
      */
  };

  return Screen;
};
