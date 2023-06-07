const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { spotsWithPreview,spotsWithAverage, numberOfReviews, addAvgStarRating, getSpotImages, getSpotOwner } = require('../../utils/spot')

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
    let spots = await Spot.findAll();

   await spotsWithAverage(spots)
   await spotsWithPreview(spots)

    res.json({
      Spots: spots
    });
});

// Get all spots by current user
router.get('/current', requireAuth, async (req, res, next) => {
  let { user } = req;
  let spots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  })
  await spotsWithAverage(spots);
  await spotsWithPreview(spots);
  res.json({
    Spots: spots
  })
})

// Get a spot by spotId
router.get('/:spotId', async (req, res, next) => {
  let { spotId } = req.params;

  let spot = await Spot.findOne({
    where:{
      id: spotId
    }

  })
  if(!spot){
    res.statusCode = 404;
    res.json({
      message: "Spot couldn't be found"
    })
  }
  await numberOfReviews(spot)
  await addAvgStarRating(spot)
  await getSpotImages(spot)
  await getSpotOwner(spot)


  res.json(spot)
})

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
