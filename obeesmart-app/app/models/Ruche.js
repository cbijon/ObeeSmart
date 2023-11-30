'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
  const Ruche = sequelize.define(
    'Ruche',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      device_name: DataTypes.STRING,
      dev_eui: DataTypes.STRING,
      // Ajoutez d'autres attributs de la ruche selon vos besoins
    },
    {
      underscored: true,
    }
  );
 
  Ruche.associate = models => {
    Ruche.hasMany(models.Harpe, {foreignKey: 'Ruche_id'});
    Ruche.hasMany(models.Scale, {foreignKey: 'Ruche_id'});
    /*
    Ruche.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
    */
    // Si la ruche n'a pas de device_name et de dev_eui, attribuez-leur une valeur par défaut
    Ruche.beforeCreate(ruche => {
      if (!ruche.device_name) {
        ruche.device_name = 'default_device_name';
      }
      if (!ruche.dev_eui) {
        ruche.dev_eui = 'default_dev_eui';
      }
    });
  };

  return Ruche;
};
