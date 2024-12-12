"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Running extends Model {
    static associate(models) {
      Running.belongsTo(models.User, { foreignKey: 'userId' });
      Running.belongsTo(models.Location, {
        foreignKey: 'locationId', // Внешний ключ в таблице Post
        as: 'location', // Псевдоним для ассоциации
      });
    }
  }
  Running.init(
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
      cadence: {
        type: DataTypes.FLOAT,
      },
      pace: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "Running",
    }
  );
  return Running;
};
