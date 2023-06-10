const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { spotsWithPreview,spotsWithAverage, numberOfReviews, addAvgStarRating, getSpotImages, getSpotOwner } = require('../../utils/spot')

const { setTokenCookie, requireAuth, spotImageOwner } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, spotImageOwner, async (req, res, next) => {
    const { imageId } = req.params;
    
    await SpotImage.destroy({
        where: {
            id: imageId
        }
    });
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
