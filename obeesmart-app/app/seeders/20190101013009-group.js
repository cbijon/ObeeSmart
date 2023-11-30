'use strict';

module.exports = {
  up: (queryInterface, sequelize) => {
    console.log('Adding group demo');
    return queryInterface.bulkInsert(
      'Group',
      [
        {
          id: '60eae00b-fa1d-4b4a-a981-f65c9c2c3b4f',
          name: 'demo',
          created_at: '2018-09-20 16:41:24.962+02',
          updated_at: '2018-09-20 16:41:24.962+02',
        },
      ],
      {}
    );
  },

  down: (queryInterface, sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
