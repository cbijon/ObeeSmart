"use strict";
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        "Hausse",
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0, // Poids de la hausse par défaut
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
          "Ruche_id", // name of the key we're adding
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
    return sequelize.dropTable("Hausse");
  },
};
