'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: 'reviewId',
        onDelete: 'cascade',
        hooks: true
      })
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Review',
        key: 'id',
        onDelete: 'cascade',
        hooks: true
      },
    },
    url: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};
