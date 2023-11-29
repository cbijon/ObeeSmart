'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('Adding extension postgis');
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
