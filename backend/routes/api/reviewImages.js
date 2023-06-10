const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')

const { setTokenCookie, requireAuth, spotOwner, reviewAuth, reviewImageAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { getSpotImages } = require('../../utils/spot');


const router = express.Router();

router.delete('/:imageId', requireAuth, reviewImageAuth, async (req, res, next) => {
    let { imageId } = req.params;

    await ReviewImage.destroy({
        where:{
            id: imageId
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
