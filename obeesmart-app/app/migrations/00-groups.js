'use strict';
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize.createTable(
      'groups',
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        underscored: true,
      }
    );
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('groups');
  },
};
