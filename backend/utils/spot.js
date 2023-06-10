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
        });
        spot.dataValues.previewImage = preview.dataValues.url;
        return spot;
      }))

      return spots;
}

//adds average rating to a spot
async function spotsWithAverage(spots) {
  await Promise.all(
    spots.map(async (spot) => {
      let rating = await Review.findOne({
        attributes: [
          [
            sequelize.fn('AVG', sequelize.col('stars')),
            'avgRating',
          ],
        ],
        where: {
          spotId: spot.id,
        },
      });

      spot.avgRating = rating.avgRating;

      return spot;
    })
  );

  return spots;
}

async function numberOfReviews(spot) {

    let totalReviews = await Review.count({
        where: {
            spotId: spot.id
        }
    });

    spot.dataValues.numReviews = totalReviews;

    return spot;
}

async function addAvgStarRating(spot){
    let rating = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('AVG', sequelize.col('Reviews.stars')),
                    'avgStarRating'
                ]
            ], group: ['Spot.id']
        },
        include: {
            model: Review,
            where: {
              spotId: spot.id
            },
            attributes: []
          },

    })

    spot.dataValues.avgStarRating = rating[0].dataValues.avgStarRating;

    return spot;
}

async function getSpotImages(spot){
  let spotImages = await spot.getSpotImages();

  let imagesArr = []

  for(let i = 0; i < spotImages.length; i++){
    let spotImage = spotImages[i].dataValues;

    let { id, url, preview } = spotImage;

    const newImgObj ={
      id,
      url,
      preview
    };

    imagesArr.push(newImgObj);
  }

  spot.dataValues.SpotImages = imagesArr;

  return spot;
}

async function getSpotOwner(spot){
  let ownerId = spot.ownerId;

  let owner = await User.findByPk(ownerId, {
    attributes: {
      include: ['id', 'firstName', 'lastName']
    }
  });

  owner = owner.dataValues;

  let { id, firstName, lastName } = owner;

  let ownerInfo = {
    id,
    firstName,
    lastName
  };

  spot.dataValues.Owner = ownerInfo;

  return spot;
}



module.exports = {
    spotsWithPreview,
    spotsWithAverage,
    numberOfReviews,
    addAvgStarRating,
    getSpotImages,
    getSpotOwner
}
