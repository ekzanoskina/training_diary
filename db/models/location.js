'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.hasMany(models.Running, {
        foreignKey: 'userId', // Внешний ключ в таблице Post
        as: 'running_workouts', // Псевдоним для ассоциации
      });
      Location.hasMany(models.Swimming, {
        foreignKey: 'userId', // Внешний ключ в таблице Post
        as: 'swimming_workouts', // Псевдоним для ассоциации
      });
      Location.hasMany(models.Cycling, {
        foreignKey: 'userId', // Внешний ключ в таблице Post
        as: 'cycling_workouts', // Псевдоним для ассоциации
      });
    }
  }
  Location.init({
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};