'use strict';
const env = process.env.NODE_ENV || 'development';
const { DataTypes } = require('sequelize');
const config = require(__dirname + '/../config/config.js')[env];


module.exports = (sequelize) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      token: DataTypes.UUID,
      userId: DataTypes.UUID,
      expires: DataTypes.DATE,
    },
    {
      underscored: true,
    }
  );
  Token.associate = (models) => {
    Token.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Token;
};
