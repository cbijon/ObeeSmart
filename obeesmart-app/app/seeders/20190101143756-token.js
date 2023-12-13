'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('Adding token demo');
    return queryInterface.bulkInsert(
      'Token',
      [
        {
          id: 'b7ce9e2f-5d61-424f-983e-1dcc3f546459',
          token: 'b7ce9e2f-5d61-424f-983e-1dcc3f546459',
          user_id: 'b7ce9e2f-5d61-424f-983e-1dcc3f546459',
          expires: '2030-09-20 16:41:24.962+02',
          created_at: '2018-09-20 16:41:24.962+02',
          updated_at: '2018-09-20 16:41:24.962+02',
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
