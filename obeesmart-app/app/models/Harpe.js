'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];

module.exports = sequelize => {
    const Harpe = sequelize.define(
      'Harpe',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        name: DataTypes.STRING,
        // Ajoutez d'autres attributs de l'harpe selon vos besoins
      },
      {
        underscored: true,
      }
    );
  
    Harpe.associate = models => {
      
      /*
      Harpe.belongsTo(models.CentraleHarpes, {
        foreignKey: 'centrale_harpes_id',
        onDelete: 'CASCADE',
      });
      */
      // Si l'harpe n'est pas explicitement associée à un utilisateur, associez-la par défaut
      Harpe.beforeCreate(async (harpe, options) => {
        if (!harpe.user_id) {
          const defaultUser = await models.User.findOne({
            where: { /* conditions pour trouver l'utilisateur par défaut */ },
          });
          harpe.user_id = defaultUser.id;
        }
      });
    };
  
    return Harpe;
  };
  