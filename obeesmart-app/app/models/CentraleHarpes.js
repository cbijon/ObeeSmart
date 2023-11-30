'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
  const CentraleHarpes = sequelize.define(
    'CentraleHarpes',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      device_name: DataTypes.STRING,
      dev_eui: DataTypes.STRING,
      // Ajoutez d'autres attributs de la centraleHarpes selon vos besoins
    },
    {
      underscored: true,
    }
  );

  CentraleHarpes.associate = models => {
    CentraleHarpes.hasMany(models.Harpe, {foreignKey: 'CentraleHarpes_id'});
    /**
    CentraleHarpes.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
     */
    // Si la centraleHarpes n'a pas de device_name et de dev_eui, attribuez-leur une valeur par défaut
    CentraleHarpes.beforeCreate(centraleHarpes => {
      if (!centraleHarpes.device_name) {
        centraleHarpes.device_name = 'default_device_name';
      }
      if (!centraleHarpes.dev_eui) {
        centraleHarpes.dev_eui = 'default_dev_eui';
      }
    });
  };

  return CentraleHarpes;
};
