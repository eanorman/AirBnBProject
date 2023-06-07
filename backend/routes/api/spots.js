const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const router = express.Router();


// Sign up
router.get('/', async (req, res) => {
    let spots = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('AVG', sequelize.col('Reviews.stars')),
                    "avgRating"
                ]
            ]
        },
        include: [
            {
            model: Review,
            attributes: []
            },
            {
                model: SpotImage,
                where: {
                    preview: true
                },
                attributes: ['url'],
                as: 'previewImage'
            }
    ]
    });

  // Extracting just the URL from the result
  const spotsImageUrlOnly = spots.map(spot => {
    const spotJson = spot.toJSON();
    spotJson.previewImage = spotJson.previewImage[0].url;
    return spotJson;
  });

  res.json(spotsImageUrlOnly);
});

module.exports = router;
