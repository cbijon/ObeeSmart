"use strict";
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        "Screen",
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          name: DataTypes.STRING,
          created_at: DataTypes.DATE,
          updated_at: DataTypes.DATE,
        },
        {
          underscored: true,
        }
      )
      .then(() => {
        return sequelize.addColumn(
          "Screen", // name of Source model
          "user_id", // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: "User", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable("Screen");
  },
};
