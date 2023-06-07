'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.imgur.com/5iRPHZe.jpeg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/KqRbvqO.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/rQHfMWn.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/Kd9vVwF.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/ezK6yyO.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/MGQoUEW.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/qStXlDp.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/bm5pxcZ.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/YVvsd3n.jpeg',
        preview: false
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    }, {});
  }
};
