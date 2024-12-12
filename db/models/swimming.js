"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Swimming extends Model {
    static associate(models) {
      Swimming.belongsTo(models.User, { foreignKey: "userId" });
      Swimming.belongsTo(models.Location, {
        foreignKey: 'locationId', // Внешний ключ в таблице Post
        as: 'location', // Псевдоним для ассоциации
      });
    }
  }
  Swimming.init(
    {
      
      date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      style: {
        type: DataTypes.STRING,
      },
      pace: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "Swimming",
    }
  );
  return Swimming;
};
