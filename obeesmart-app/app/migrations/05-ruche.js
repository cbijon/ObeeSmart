"use strict";
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        "Ruche",
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          name: DataTypes.STRING,
          baseWeight: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0, // Poids de la base de la ruche vide par défaut
          },
          isTare: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Par défaut, la hausse n'est pas une tare
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
          "Ruche", // name of Source model
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
      }).then(() => {
        return sequelize.addColumn(
          "Ruche", // name of Source model
          "ruchier_id", // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: "Ruchier", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      })
      .then(() => {
        return sequelize.addColumn(
          "Ruche", // name of Source model
          "screen_id", // name of the key we're adding
          {
            type: DataTypes.UUID,
            references: {
              model: "Screen", // name of Target model
              key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      });
  },
  down: (sequelize, DataTypes) => {
    return sequelize.dropTable("Ruche");
  },
};
