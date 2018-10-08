const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
      try {
        const password = await bcrypt.hash('admin', 10);

        return await queryInterface.bulkInsert('Users', [{
          name: 'admin',
          email: 'admin@admin.uz',
          password,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});
      } catch (error) {
        console.log(error);
      }
    },

    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
    }
};