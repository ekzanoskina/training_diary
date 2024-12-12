'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Swimmings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('gen_random_uuid') // 
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Имя таблицы Locations
          key: "id",
        },
      },
      locationId: {
        // Внешний ключ для связи с таблицей Location
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Locations", // Имя таблицы Locations
          key: "id",
        },
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      duration: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      style: {
        type: Sequelize.STRING,
      },
      pace: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Swimmings');
  }
};