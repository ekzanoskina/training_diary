'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Runnings', [
      {
        date: new Date(2023, 11, 31, 23, 59, 59),
        userId: 1,
        locationId: 1,
        distance: 5.0,
        duration: 25,
        cadence: 180,
        pace: 5.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(2023, 10, 31, 23, 59, 59),
        userId: 2,
        locationId: 2,
        distance: 10.0,
        duration: 50,
        cadence: 170,
        pace: 5.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Runnings', null, {});
  }
};
