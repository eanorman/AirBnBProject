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
        if(preview){
          spot.dataValues.previewImage = preview.dataValues.url
        } else{
          spot.dataValues.previewImage = ""
        }
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

      let ratingNumber = rating.dataValues.avgRating;
      if(ratingNumber){
        ratingNumber = ratingNumber.toFixed(1)
        spot.dataValues.avgRating = Number.parseFloat(ratingNumber)
      } else {
        spot.dataValues.avgRating = 0;
      }
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
  let rating = await Review.findAll({
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

  let ratingNumber = rating[0].dataValues.avgRating;
  ratingNumber = Number.parseFloat(ratingNumber).toFixed(1)
  spot.dataValues.avgStarRating = Number.parseFloat(ratingNumber)
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
