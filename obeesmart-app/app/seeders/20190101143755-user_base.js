'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('Adding user admin demo');
    return queryInterface.bulkInsert(
      'User',
      [
        {
          id: 'b7ce9e2f-5d61-424f-983e-1dcc3f546459',
          group_id: '60eae00b-fa1d-4b4a-a981-f65c9c2c3b4f',
          login: 'admin',
          firstname: 'admin',
          lastname: 'admin',
          email: 'bijon.charles@gmail.com',
          password:
            '$2b$10$NVS.6nv1vmf7JCCcef.0h.DH1FM5UTA41yLwkI2XpFEXShiE3R5um',
          manager_id: 'b7ce9e2f-5d61-424f-983e-1dcc3f546459',
          is_manager: true,
          is_admin: true,
          role: 'enable',
          authtype: 'local',
          contact_tel: '+3300000000',
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
