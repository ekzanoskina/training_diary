'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Locations', [
      {
        latitude: 40.7128,
        longitude: -74.0060,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        latitude: 34.0522,
        longitude: -118.2437,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        latitude: 51.5074,
        longitude: -0.1278,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locations', null, {});
  }
};
