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
      name: DataTypes.STRING,
      baseWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0, // Poids de la base de la ruche vide par défaut
      },
      isTare: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Par défaut, la hausse n'est pas une tare
      },
    },
    {
      underscored: true,
    }
  );
 
  Ruche.associate = models => {
    Ruche.hasMany(models.Harpe, {foreignKey: 'Ruche_id'});
    Ruche.hasMany(models.Scale, {foreignKey: 'Ruche_id'});
    Ruche.hasMany(models.Hausse, { foreignKey: 'Ruche_id' });
    Ruche.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Ruche.belongsTo(models.Ruchier, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
    });
    
    // Si la ruche n'a pas de device_name et de dev_eui, attribuez-leur une valeur par défaut
    Ruche.beforeCreate(Ruche => {
      if (!Ruche.device_name) {
        Ruche.device_name = 'default_device_name';
      }
      if (!Ruche.dev_eui) {
        Ruche.dev_eui = 'default_dev_eui';
      }
    });
  };

  return Ruche;
};
