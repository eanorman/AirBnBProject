const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')

const { setTokenCookie, requireAuth, spotOwner, reviewAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { getSpotImages } = require('../../utils/spot');

const router = express.Router();

// Get all reviews from the current user
router.get('/current', requireAuth, async (req, res, next) => {
    let { user } = req;

    let reviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })

    await getReviewUser(reviews)
    await getReviewSpot(reviews);
    await getReviewImages(reviews);

    res.json({
        Reviews: reviews
    })
});

router.post('/:reviewId/images', requireAuth, reviewAuth, async (req, res, next) => {
    const { reviewId } = req.params;

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    })

    if(reviewImages.length >= 10){
        res.statusCode = 403;
        res.json({
            message: "Maximum number of images for this resource was reached"
        })
    } else {
        const newImage = await ReviewImage.create({
            reviewId,
            url: req.body.url
        })

        res.json(newImage)
    }
})

module.exports = router;
