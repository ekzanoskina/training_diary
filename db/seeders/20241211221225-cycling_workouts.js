'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cyclings', [
      {
        date: new Date(2023, 8, 24, 23, 59, 59),
        userId: 2,
        locationId: 1,
        distance: 20.0,
        duration: 60,
        cadence: 90,
        speed: 20.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(2022, 7, 31, 23, 59, 59),
        userId: 3,
        locationId: 2,
        distance: 15.0,
        duration: 45,
        cadence: 85,
        speed: 20.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cyclings', null, {});
  }
};
