// log.js
"use strict";
const env = process.env.NODE_ENV || "development";
const { Sequelize, DataTypes } = require("sequelize");
const config = require(__dirname + "/../config/config.js")[env];

module.exports = (sequelize) => {
  const Log = sequelize.define(
    "Log",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSON, // Adjust the data type based on the details you want to log
        allowNull: true,
      },
      logdate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  // Associate the Log model with other models if needed
  // For example, if you want to associate logs with users:
  // Log.belongsTo(models.User, { foreignKey: 'user_id' });
  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return Log;
};
