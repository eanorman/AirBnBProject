'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        startDate: '2023-06-02',
        endDate: '2023-06-04'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2023-05-25',
        endDate: '2023-05-27'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2023-07-05',
        endDate: '2023-07-15'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
