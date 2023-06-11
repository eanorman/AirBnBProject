const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../db/models');
const { response } = require('express');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

// Checks if current user is the owner of the spot
const spotOwner = async function(req, res, next) {
  const { user } = req;
  const { spotId } = req.params;

  let spot = await Spot.findByPk(spotId);


  if(!spot){
   res.statusCode = 404;
   res.json({
     message: "Spot couldn't be found"
   })
  } else {
    if(spot.ownerId !== user.id){
      const err = new Error('Authentication required');
      err.title = 'Authentication required';
      err.errors = { message: 'Authentication required' };
      err.status = 401;
      return next(err);
    }

    return next();

  }

}

const spotImageOwner = async function(req, res, next) {
  const { user } = req;
  const { imageId } = req.params;

  let spotImage = await SpotImage.findOne({
    where: {
      id: imageId
    }
  });



  if(!spotImage){
    res.statusCode = 404;
    res.json({
      message: "Spot Image couldn't be found"
    })
  } else {
    let spotId = spotImage.dataValues.spotId
    let spot = await Spot.findByPk(spotId)
    if(spot.ownerId !== user.id){
       const err = new Error('Authentication required');
       err.title = 'Authentication required';
       err.errors = { message: 'Authentication required' };
       err.status = 401;
       return next(err);
     }

     return next();

   }
}

const spotReviewAuth = async function (req, res, next){
  const { user } = req;
  const { spotId } = req.params
  let spot = await Spot.findByPk(spotId);
  if(!spot){
    res.statusCode = 404;
    res.json({
      message: "Spot couldn't be found"
    })
  } else {
    let spotReviews = await spot.getReviews();
    spotReviews.forEach((review) =>{
      if(review.dataValues.userId === user.id){
        res.statusCode = 403
        res.json({
          message: "User already has a review for this spot"
        })
      }
    })
    return next();
  }
}

const reviewAuth = async function(req, res, next){
  let { reviewId } = req.params;
  let { user } = req;

  let review = await Review.findByPk(reviewId);

  if(!review){
    res.statusCode = 404;
    res.json({
      message: "Review couldn't be found"
    })
  } else {
      if(review.userId !== user.id){
        const err = new Error('Authentication required');
        err.title = 'Authentication required';
        err.errors = { message: 'Authentication required' };
        err.status = 401;
        return next(err);
      } else{
        return next();
      }
  }
}

const reviewImageAuth = async function(req, res, next) {
  let { user } = req;
  let { imageId } = req.params;

  let reviewImage = await ReviewImage.findByPk(imageId);

  if(!reviewImage){
    res.statusCode = 404;
    res.json({
      message: "Review Image couldn't be found"
    })
  } else {
    let review = await Review.findByPk(reviewImage.reviewId);
    if(review.userId !== user.id){
      const err = new Error('Authentication required');
      err.title = 'Authentication required';
      err.errors = { message: 'Authentication required' };
      err.status = 401;
      return next(err);
    } else {
      return next();
    }
  }
}

const bookingAuth = async function(req, res, next){
  const { bookingId } = req.params;
  const { user } = req;
  let booking = await Booking.findOne({ where: {id: bookingId}})
  let spotId = booking.spotId
  let spot = await Spot.findByPk(spotId)
  console.log(spot.ownerId)

  if(!booking){
    res.statusCode = 404;
    res.json({
      message: "Spot couldn't be found"
    })
    return;
  }
  if(booking.userId !== user.id && spot.ownerId !== user.id){
    res.statusCode = 403;
    res.json({
      message: "Cannot delete a booking that is not your own."
    })
    return;
  }

  let date = new Date()
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`
  console.log(booking.dataValues.startDate)

  if(currentDate > booking.startDate){
    res.statusCode = 403
    res.json({
      message: "Bookings that have been started can't be deleted"
    })
    return;
  }
  return next();
}

const bookingDateValid = async function(req, res, next) {
  let { spotId } = req.params
  let { startDate, endDate } = req.body;
  let { user } = req;
  let bookings = await Booking.findAll({  where:{  spotId  } });

  let bookedDates = []

  let responseMessage = {
    message: "Sorry, this spot is already booked for the specified dates",
    errors: {}
  }

  let spot = await Spot.findByPk(spotId)
  if(!spot){
    res.statusCode = 404;
    res.json({
      message: "Spot couldn't be found"
    })
  }

  if(spot.ownerId === user.id){
    res.statusCode = 403;
    res.json({
      message: "Cannot create booking a spot you own."
    })
  }

  if(startDate > endDate){
    res.statusCode = 403;
    res.json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    })
  }

  for(let i = 0; i < bookings.length; i++){
    let booking = bookings[i];
    let startDate = booking.startDate;
    let endDate = booking.endDate;

    let bookedDate = [startDate, endDate];
    bookedDates.push(bookedDate)
  }
  for(let i = 0; i < bookedDates.length; i++) {
    let bookedDate = bookedDates[i];


   if((startDate <= bookedDate[0]) && !(endDate < bookedDate[1])){
    responseMessage.errors.endDate = "End date conflicts with an existing booking"
   }
   if((startDate >= bookedDate[0]) && !(startDate > bookedDate[1])){
    responseMessage.errors.startDate = "Start date conflicts with an existing booking"
   }
   if((startDate > bookedDate[0]) && (endDate < bookedDate[1])){
    responseMessage.errors.endDate = "End date conflicts with an existing booking"
   }


  }
 let size = Object.keys(responseMessage.errors)
 console.log(size)
  if(size.length > 0){
    res.statusCode = 403;
    res.json(responseMessage)
  } else{
    return next();
  }


}

const editBookingValid = async function (req, res, next) {
  let { bookingId } = req.params
  let { startDate, endDate } = req.body;
  let { user } = req;

  let date = new Date()
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`

  if(currentDate > endDate){
    res.statusCode = 400;
    res.json({
      message: "Past bookings can't be modified"
    })
    return;
  }
  let editBooking = await Booking.findOne({  where:{  id: bookingId } });
  let spotId = editBooking.spotId

  if(!editBooking){
    res.statusCode = 404;
    res.json({
      message: "Booking couldn't be found"
    })
    return;
  }

  if(editBooking.userId !== user.id){
    res.statusCode = 403;
    res.json({
      message: "Cannot edit a booking that is not your own."
    })
    return;
  }


  let bookings = await Booking.findAll({  where:{  spotId } });

  let responseMessage = {
    message: "Sorry, this spot is already booked for the specified dates",
    errors: {}
  }

  if(startDate > endDate){
    res.statusCode = 403;
    res.json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    })
    return;
  }

  let bookedDates = []

  for(let i = 0; i < bookings.length; i++){
    let booking = bookings[i];
    let startDate = booking.startDate;
    let endDate = booking.endDate;

    let bookedDate = [startDate, endDate];
    bookedDates.push(bookedDate)
  }
  for(let i = 0; i < bookedDates.length; i++) {
    let bookedDate = bookedDates[i];


   if((startDate <= bookedDate[0]) && !(endDate < bookedDate[1])){
    responseMessage.errors.endDate = "End date conflicts with an existing booking"
   }
   if((startDate >= bookedDate[0]) && !(startDate > bookedDate[1])){
    responseMessage.errors.startDate = "Start date conflicts with an existing booking"
   }
   if((startDate > bookedDate[0]) && (endDate < bookedDate[1])){
    responseMessage.errors.endDate = "End date conflicts with an existing booking"
   }


  }
 let size = Object.keys(responseMessage.errors)
  if(size.length > 0){
    res.statusCode = 403;
    res.json(responseMessage)
  } else{
    return next();
  }
}

module.exports = { bookingAuth, editBookingValid, setTokenCookie, restoreUser, requireAuth, spotOwner, spotImageOwner, spotReviewAuth, reviewAuth, reviewImageAuth, bookingDateValid };
