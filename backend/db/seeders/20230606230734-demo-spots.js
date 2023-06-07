'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 2,
        address: '123 Main Street',
        city: 'Chicago',
        state: 'Illinois',
        country: 'United States of America',
        lat: 12.4567868,
        lng: 45.4567865,
        name: 'Small Apartment',
        description: 'A very tiny apartment',
        price: 20
      },
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123
      },
      {
        ownerId: 3,
        address: '1543 Northsouth Street',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 12.4567845,
        lng: -122.5648385,
        name: 'A large loft',
        description: 'Sun-soaked and beige-y.',
        price: 1547
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
