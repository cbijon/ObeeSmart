"use strict";
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        "Harpe",
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
          "Harpe", // name of Source model
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
      })
      .then(() => {
        return sequelize.addColumn(
          "Harpe", // name of Source model
          "harpe_id", // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: "CentraleHarpes", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      })
      .then(() => {
        return sequelize.addColumn(
          "Harpe", // name of Source model
          "ruche_id", // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: "Ruche", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable("Harpe");
  },
};
