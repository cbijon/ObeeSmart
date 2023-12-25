'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
  const Ruchier = sequelize.define(
    'Ruchier',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      longitude: DataTypes.FLOAT,
      latitude: DataTypes.FLOAT,
      streetname: DataTypes.STRING,       // Nouveau champ pour le nom de la rue
      postalcode: DataTypes.STRING,       // Nouveau champ pour le code postal
      city: DataTypes.STRING,              // Nouveau champ pour la ville
      country: DataTypes.STRING,           // Nouveau champ pour le pays
      // Ajoutez d'autres attributs du ruchier selon vos besoins
    },
    {
      underscored: true,
    }
  );

  Ruchier.associate = models => {
    Ruchier.hasMany(models.Ruche, { foreignKey: 'ruchier_id' });    
  };

  return Ruchier;
};
