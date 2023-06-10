'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'cascade',
        hooks: true
      })

      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        hooks: true
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Spot',
        key: 'id'
      },
      onDelete: 'cascade',
      hooks: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'cascade',
      hooks: true
    },
    startDate: {
      type: DataTypes.DATEONLY
    },
    endDate: {
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
