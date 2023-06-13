const { User, Spot, SpotImage } = require('../db/models');

//Adds user information to a review
async function getReviewUser(reviews){
    await Promise.all(reviews.map(async (review) =>{
        let userId = review.userId

        let user = await User.findOne({
          where: {
            id: userId,
          },
          attributes: {
            include: ['id', 'firstName', 'lastName'],
            exclude: ['username']
          }
        });


        review.dataValues.User = user;
        return review;
      }))

      return reviews;
}

//Adds spot information to a review
async function getReviewSpot(reviews){
    await Promise.all(reviews.map(async (review) => {
        let spotId = review.spotId
        let spot = await Spot.findOne({
            where: {
                id: spotId
            },
            attributes:{
                exclude: ['updatedAt', 'createdAt', 'description']
            }
        })
        spot.dataValues.lat = parseFloat(spot.dataValues.lat);
        spot.dataValues.lng = parseFloat(spot.dataValues.lng);
        review.dataValues.Spot = spot;
    }))

    await getReviewSpotPreview(reviews);
    return reviews;
}

//Adds a preview image to a spot
async function getReviewSpotPreview(reviews){
    await Promise.all(reviews.map(async (review) => {
        let spotId = review.spotId
        let preview = await SpotImage.findOne({
            where: {
                spotId,
                preview: true
            }
        })
        if(preview){
            review.dataValues.Spot.dataValues.previewImage = preview.dataValues.url;
        }
        return review
    }))
    return reviews;
}

//Adds an array of reviewImages to an array of reviews
async function getReviewImages(reviews){
    await Promise.all(reviews.map(async (review) => {
        let reviewId = review.id;
        let imageArr = []
        let reviewImages = await review.getReviewImages();
        for(let i = 0; i < reviewImages.length; i++) {
            let reviewImage = reviewImages[i].dataValues;
            let { id, url, preview } = reviewImage;

            let newImgObj = {
                id,
                url,
                preview
            }
            imageArr.push(newImgObj);
        }
        review.dataValues.ReviewImages = imageArr
    }))

    return reviews;
}


module.exports = {
    getReviewUser,
    getReviewSpot,
    getReviewImages
}
