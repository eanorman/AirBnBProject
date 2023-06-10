const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { spotsWithPreview,spotsWithAverage, numberOfReviews, addAvgStarRating, getSpotImages, getSpotOwner } = require('../../utils/spot')
const { getReviewSpot, getReviewUser, getReviewImages } = require('../../utils/review')
const { requireAuth, spotOwner, spotReviewAuth, bookingDateValid } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');

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

// Get reviews by spotId
router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
  let { spotId } = req.params;
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
router.post('/:spotId/reviews', validateReview, requireAuth, spotReviewAuth, async (req, res, next) => {
  const { review, stars } = req.body
  const { user } = req;
  const { spotId } = req.params
  let spot = await Spot.findByPk(spotId);
  if(!spot){
    res.statusCode = 404;
    res.json("Spot couldn't be found")
  }

   let spotReview = await Review.create({
      userId: user.id,
      spotId,
      review,
      stars
   })


   res.json(spotReview);
})

// Get bookings by spotId
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { user } = req;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if(!spot){
    res.statusCode = 404;
    res.json({
      message: "Spot couldn't be found"
    })
  } else {
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
          exclude: ['id', 'userId', 'createdAt', 'updatedAt']
        }
      })
      res.json({
        Bookings: bookings}
        )
    }

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

// add an image to a spot based on the spot's id
router.post('/:spotId/images', requireAuth, spotOwner, async (req, res, next) => {

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
router.put('/:spotId', validateSpot, requireAuth, spotOwner, async (req, res, next) => {
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
router.delete('/:spotId', requireAuth, spotOwner, async (req, res, next) => {
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
