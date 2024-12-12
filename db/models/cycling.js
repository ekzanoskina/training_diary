"use strict";
const { v4: uuidv4 } = require('uuid');

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cycling extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cycling.belongsTo(models.User, { foreignKey: "userId" });
      Cycling.belongsTo(models.Location, {
        foreignKey: 'locationId', // Внешний ключ в таблице Post
        as: 'location', // Псевдоним для ассоциации
      });
      
    }
  }
  Cycling.init(
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
      speed: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "Cycling",
    }
  );
  return Cycling;
};
