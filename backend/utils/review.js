const { User, Spot, Review, SpotImage } = require('../db/models');
const  sequelize  = require('sequelize')
const { spotsWithPreview } = require('./spot')

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
        console.log(review.Review)
        console.log(review.dataValues)
        review.Review.dataValues.User = user;
        return review;
      }))

      return reviews;
}

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
        review.Review.dataValues.Spot = spot;
    }))

    await getReviewSpotPreview(reviews);
    return reviews;
}

async function getReviewSpotPreview(reviews){
    await Promise.all(reviews.map(async (review) => {
        let spotId = review.spotId
        let preview = await SpotImage.findOne({
            where: {
                spotId,
                preview: true
            }
        })

        review.dataValues.Spot.dataValues.previewImage = preview.dataValues.url;
        return review
    }))
    return reviews;
}

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
