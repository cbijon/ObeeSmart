'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
    const Scale = sequelize.define(
      'Scale',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        // Ajoutez d'autres attributs d'échelle selon vos besoins
      },
      {
        underscored: true,
      }
    );
    
    Scale.associate = models => {
      
      
      Scale.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      
      Scale.belongsTo(models.Ruche, {
        foreignKey: 'ruche_id',
        onDelete: 'CASCADE',
      });
      
    };
    
    return Scale;
  };