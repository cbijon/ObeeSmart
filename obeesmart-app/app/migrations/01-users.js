'use strict';
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        'users',
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
          },
          login: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
          },
          firstname: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          lastname: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          manager_id: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          is_manager: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
          is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
          },
          role: {
            type: DataTypes.ENUM,
            values: ['enable', 'disabled'],
            defaultValue: 'disabled',
          },
          authtype: {
            type: DataTypes.ENUM,
            values: ['local', 'ldap'],
            defaultValue: 'local',
          },
          contact_tel: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          created_at: DataTypes.DATE,
          updated_at: DataTypes.DATE,
        },
        {
          underscored: true,
        }
      )
      .then(() => {
        return sequelize.addColumn(
          'users', // name of Source model
          'group_id', // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: 'groups', // name of Target model
              key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable('users');
  },
};
