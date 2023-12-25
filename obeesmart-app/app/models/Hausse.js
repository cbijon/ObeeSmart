'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
  const Hausse = sequelize.define(
    'Hausse',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0, // Poids de la hausse par défaut
      },
      isTare: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Par défaut, la hausse n'est pas une tare
      },
      // Ajoutez d'autres attributs de la hausse selon vos besoins
    },
    {
      underscored: true,
    }
  );

  Hausse.associate = models => {
    Hausse.belongsTo(models.Ruche, {
      foreignKey: 'Ruche_id',
      onDelete: 'CASCADE',
    });
  };

  return Hausse;
};
