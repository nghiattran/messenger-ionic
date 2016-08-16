'use strict';
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  sequelize: {
    database: 'Zade',
    username: 'zade',
    password: 'zadepass',
    options: {
      logging: false,
    }
  }
};
