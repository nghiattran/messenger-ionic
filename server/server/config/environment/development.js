'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    database: 'Zade',
    username: 'zade',
    password: 'zadepass',
    options: {
      logging: false,
    }
  },

  // Seed database on startup
  seedDB: true

};
