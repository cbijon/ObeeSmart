'use strict';

module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        "Token",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      token: DataTypes.UUID,
      //userId: DataTypes.UUID,
      expires: DataTypes.DATE,
    },
    {
      underscored: true,
    })
    .then(() => {
        return sequelize.addColumn(
          'Token', // name of Source model
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
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('Token');
  },
};
