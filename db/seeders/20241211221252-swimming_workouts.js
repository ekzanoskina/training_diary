'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Swimmings', [
      {
        date: new Date(),
        userId: 3,
        locationId: 1,
        distance: 1000, // в метрах
        duration: 30, // в минутах
        style: 'Кроль',
        pace: (30 / (1000 / 60)), // Темп в минутах на километр
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: new Date(),
        userId: 2,
        locationId: 2,
        distance: 500, // в метрах
        duration: 15, // в минутах
        style: 'Брасс',
        pace: (15 / (500 / 60)), // Темп в минутах на километр
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Swimmings', null, {});
  }
};
