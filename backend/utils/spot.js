const { User, Review, SpotImage } = require('../db/models');
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
        spot.dataValues.lat = parseFloat(spot.dataValues.lat);
        spot.dataValues.lng = parseFloat(spot.dataValues.lng);
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
        roundedNumber = Math.round(ratingNumber * 10) / 10;
        spot.dataValues.avgRating = roundedNumber.toFixed(1);
        
        // Check if the result has no decimal point and add ".0" if needed
        if (spot.dataValues.avgRating.indexOf('.') === -1) {
          spot.dataValues.avgRating += ".0";
        }
      } else {
        spot.dataValues.avgRating = 0;
      }
      return spot;
    })
  );

  return spots;
}

//Adds number of reviews to a spot
async function numberOfReviews(spot) {

    let totalReviews = await Review.count({
        where: {
            spotId: spot.id
        }
    });

    spot.dataValues.numReviews = totalReviews;

    return spot;
}

// Adds avgStarRating to a spot
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
  roundedNumber = Math.round(ratingNumber * 10) / 10;
  spot.dataValues.avgStarRating = roundedNumber.toFixed(1);
  
  // Check if the result has no decimal point and add ".0" if needed
  if (spot.dataValues.avgStarRating.indexOf('.') === -1) {
    spot.dataValues.avgStarRating += ".0";
  }
  return spot;
}

//adds an array of spotImages to a spot
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

//Adds the owner's information to a spot
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
  spot.dataValues.lat = parseFloat(spot.dataValues.lat);
  spot.dataValues.lng = parseFloat(spot.dataValues.lng);

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
