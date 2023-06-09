const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')
const { requireAuth, reviewAuth, reviewExists } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');


const router = express.Router();

const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .isNumeric()
      .withMessage('Stars must be an integer from 1 to 5'),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    check('stars')
      .isIn([1, 2, 3, 4, 5])
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

// Get all reviews from the current user
router.get('/current', requireAuth, async (req, res) => {
    let { user } = req;

    let reviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })
    if(!reviews){
        res.statusCode = 404;
        res.json({
            message: 'You have no reviews.'
        })
    }

    await getReviewUser(reviews)
    await getReviewSpot(reviews);
    await getReviewImages(reviews);

    res.json({
        Reviews: reviews
    })
});

// Add an image to a review based on reviewId
router.post('/:reviewId/images', requireAuth, reviewExists, reviewAuth, async (req, res) => {
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
        const returnImage = await ReviewImage.findOne({
            where: {
                id: newImage.dataValues.id
            },
            attributes: {
                exclude: ["reviewId", 'createdAt', 'updatedAt']
              }
        })

        res.json(returnImage)
    }
});

//Edit a review based on reviewId
router.put('/:reviewId', requireAuth, reviewExists, reviewAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const updateReview = await Review.findByPk(reviewId)

    await updateReview.update({
        review,
        stars
    })

    res.json(updateReview)
})

//Delete a review based on reviewId
router.delete('/:reviewId', requireAuth, reviewExists, reviewAuth, async (req, res) => {
    let { reviewId } = req.params;

    await Review.destroy({
        where: {
            id: reviewId
        }
    })
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
