const { User, Spot, Review, SpotImage } = require('../db/models');
const  sequelize  = require('sequelize')

// adds preview image url to a spot
async function spotsWithPreview(spots) {
    await Promise.all(spots.map(async (spot) =>{

        let preview = await SpotImage.findOne({
          where: {
            spotId: spot.id,
            preview: true
          }
        })
        spot.dataValues.previewImage = preview.dataValues.url;
        return spot;
      }))

      return spots
}

//adds average rating to a spot
async function spotsWithAverage(spots) {
    await Promise.all(spots.map(async (spot) => {

        let rating = await Spot.findAll({
          attributes: {
            include: [
              [
                sequelize.fn('AVG', sequelize.col('Reviews.stars')),
                'avgRating'
              ]
            ]
          },
          include: {
            model: Review,
            where: {
              spotId: spot.id
            },
            attributes: []
          }
        })

        spot.dataValues.avgRating = rating[0].dataValues.avgRating;

        return spot;
    }))

    return spots
}


module.exports = {
    spotsWithPreview,
    spotsWithAverage
}
