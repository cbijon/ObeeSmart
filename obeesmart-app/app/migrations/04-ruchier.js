"use strict";
module.exports = {
  up: (sequelize, DataTypes) => {
    return sequelize
      .createTable(
        'Ruchier',
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
          },
          name: DataTypes.STRING,
          longitude: DataTypes.FLOAT,
          latitude: DataTypes.FLOAT,
          streetName: DataTypes.STRING,       // Nouveau champ pour le nom de la rue
          postalCode: DataTypes.STRING,       // Nouveau champ pour le code postal
          city: DataTypes.STRING,              // Nouveau champ pour la ville
          country: DataTypes.STRING,           // Nouveau champ pour le pays
        },
        {
          underscored: true,
        }
      )
      .then(() => {
        return sequelize.addColumn(
          "Ruchier", // name of Source model
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
    return sequelize.dropTable("Ruchier");
  },
};
