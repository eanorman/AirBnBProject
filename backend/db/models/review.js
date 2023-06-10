'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'cascade',
        hooks: true
      })

      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        hooks: true
      })

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'cascade',
        hooks: true
      })
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Spot',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
