'use strict';
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
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
      )
      .then(() => {
        return sequelize.addColumn(
          'Scale', // name of Source model
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
          'Scale', // name of Source model
          'ruche_id', // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: 'Ruche', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('Scale');
  },
};
