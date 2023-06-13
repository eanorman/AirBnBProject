const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { spotsWithPreview,spotsWithAverage, numberOfReviews, addAvgStarRating, getSpotImages, getSpotOwner } = require('../../utils/spot')
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')
const { requireAuth, spotExists, spotAuth, spotReviewAuth, bookingDateValid, reviewExists } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');
const {validateQuery,spotFilter } = require('../../utils/spot-filter')

const { Op } = require("sequelize");

const router = express.Router();


const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('address')
      .isAlphanumeric('en-US', {  ignore: ' '  })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('city')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('state')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('country')
      .isAlpha('en-US', {  ignore: ' '  })
      .withMessage('Country is required'),
    check('lat')
      .isDecimal({ decimal_digits: '0,15' })
      .withMessage('Latitude is not valid'),
    check('lng')
      .isDecimal({ decimal_digits: '0,15' })
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
      .isInt({min: 0})
      .withMessage('Price must be a valid number'),
    handleValidationErrors
  ];

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



// Get all spots
router.get('/', validateQuery,  async (req, res) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = parseInt(page);
  size = parseInt(size)


  if (isNaN(page)) page = 1;
  if (isNaN(size)) size = 20;
  if (page > 10 || page < 1) page = 1
  if (size > 20 || size < 1) size = 20;

  const where = {};
  if(minLat && maxLat){
    minLat = parseInt(minLat)
    maxLat = parseInt(maxLat)
    where.lat = { [Op.and]: [{[Op.gte]: minLat},  {[Op.lte]: maxLat}] }

  } else if(minLat){
    minLat = parseInt(minLat)
    where.lat = { [Op.gte]: minLat }

  } else if(maxLat){
    maxLat = parseInt(maxLat)
    where.lat = { [Op.lte]: maxLat }
  }

  if(minLng && maxLng){
    minLng = parseInt(minLng)
    maxLng = parseInt(maxLng)
    where.lng = { [Op.and]: [{[Op.gte]: minLng},  {[Op.lte]: maxLng}] }

  } else if(minLng){
    minLat = parseInt(minLng)
    where.lng = { [Op.gte]: minLng }

  } else if(maxLng){
    maxLat = parseInt(maxLng)
    where.lng = { [Op.lte]: maxLng }
  }

  if(minPrice && maxPrice){
    minPrice = parseInt(minPrice)
    maxPrice = parseInt(maxPrice)
    where.price = { [Op.and]: [{[Op.gte]: minPrice},  {[Op.lte]: maxPrice}] }

  } else if(minPrice){
    minPrice = parseInt(minPrice)
    where.price = { [Op.gte]: minPrice }

  } else if(maxPrice){
    maxPrice = parseInt(maxPrice)
    where.price = { [Op.lte]: maxPrice }
  }

  let spots = await Spot.findAll({where, limit: size, offset: size * (page - 1), group: ['Spot.id']});

   await spotsWithAverage(spots)
   await spotsWithPreview(spots)

    res.json({
      Spots: spots,
      page,
      size
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

// Get reviews by spotId
router.get('/:spotId/reviews', spotExists, async (req, res, next) => {
  let { spotId } = req.params;
  let spot = await Spot.findByPk(spotId)

  let reviews = await Review.findAll({
    where: {
      spotId
    }
  })
  await getReviewUser(reviews);
  await getReviewImages(reviews);
  res.json({
    Reviews: reviews});
})

// Create a review by spotId
router.post('/:spotId/reviews', validateReview, requireAuth, spotReviewAuth, spotExists, async (req, res, next) => {
  const { review, stars } = req.body
  const { user } = req;
  const { spotId } = req.params

   let spotReview = await Review.create({
      userId: user.id,
      spotId,
      review,
      stars
   })

   res.statusCode = 201;
   res.json(spotReview);
})

// Get bookings by spotId
router.get('/:spotId/bookings', requireAuth, spotExists, async (req, res, next) => {
  const { user } = req;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);


    if(spot.ownerId === user.id){
      const bookings = await Booking.findAll({
        where: {
          spotId
        },
          include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
      })
      res.json({
        Bookings: bookings
      })
    } else {
      const bookings = await Booking.findAll({
        where: {
          spotId
        },
        attributes:{
          include: ['id', 'url'],
          exclude: ['userId', 'createdAt', 'updatedAt']
        }
      })
      res.json({
        Bookings: bookings}
        )
    }



})

// Create a booking
router.post('/:spotId/bookings', requireAuth, bookingDateValid, async (req, res, next) => {
  let { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;
  spotId = parseInt(spotId)
  const newBooking = await Booking.create({
    spotId,
    userId: user.id,
    startDate,
    endDate
  })
  res.json(newBooking)
})


// Get a spot by spotId
router.get('/:spotId', spotExists, async (req, res, next) => {
  let { spotId } = req.params;

  let spot = await Spot.findOne({
    where:{
      id: spotId
    }
  })


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
     res.statusCode = 201;
     res.json(spot)
})

// add an image to a spot based on the spot's id
router.post('/:spotId/images', requireAuth, spotExists, spotAuth, async (req, res, next) => {

  const { spotId } = req.params;
  const { url, preview } = req.body;

  let spotImage = await SpotImage.create({
    spotId,
    url,
    preview
  })

  res.json({
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview
  })
})

// Edit a spot
router.put('/:spotId', validateSpot, requireAuth, spotExists, spotAuth, async (req, res, next) => {
 let { address, city, state, country, lat, lng, name, description, price } = req.body
  let { spotId } = req.params

 let spot = await Spot.findByPk(spotId);


 await spot.update({
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

 res.json(spot)
})

// Delete a spot
router.delete('/:spotId', requireAuth, spotExists, spotAuth, async (req, res, next) => {
  let { spotId } = req.params;

 await Spot.destroy({
  where: {
     id: spotId
  }
 })

  res.json({
    message: "Successfully deleted"
  })
})




module.exports = router;
