const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')

const { setTokenCookie, requireAuth, spotOwner } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
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
})

module.exports = router;
