'use strict';
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
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
      )
      .then(() => {
        return sequelize.addColumn(
          'CentraleHarpes', // name of Source model
          'user_id', // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: 'User', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        );
      }).then(() => {
        return sequelize.addColumn(
          'CentraleHarpes', // name of Source model
          'screen_id', // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: 'Screen', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('CentraleHarpes');
  },
};
