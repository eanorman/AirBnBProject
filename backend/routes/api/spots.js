const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');

const router = express.Router();


const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('address')
      .isAlphanumeric('en-US', {  ignore: ' '  })
      .withMessage('Must be a valid address'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('city')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('Must be a valid city'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('state')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('Must be a valid state'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('country')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('Must be a valid country'),
    check('lat')
      .exists({ checkFalsy: true })
      .isDecimal({ decimal_digits: '1,7' })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .isDecimal({ decimal_digits: '1,7' })
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Name is required'),
    check('name')
      .isLength({  max: 50  })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    check('price')
      .isNumeric()
      .withMessage('Price must be a valid number'),
    handleValidationErrors
  ];

// Get all spots
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

// Create a spot
router.post('/', validateSpot, requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const { user } = req;
     let spot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
     })

     res.json(spot);
})

module.exports = router;
