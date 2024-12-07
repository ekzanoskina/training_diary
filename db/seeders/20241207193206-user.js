'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('mypassword', 10);
    const hashedPassword3 = await bcrypt.hash('mypassword456', 10);

    await queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        username: 'user1',        
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user2@example.com',
        username: 'user2',  
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user3@example.com',
        username: 'user3',  
        password: hashedPassword3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
