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

// Checks that spot exists
const spotExists = async function(req, res, next){
  let {spotId} = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot){
    const err = new Error("Spot couldn't be found");
    err.title = "Spot couldn't be found";
    err.errors = { message: "Spot couldn't be found"};
    err.status = 404;
    return next(err);
  }

  return next();
}

// Checks that user owns the spot
const spotAuth = async function (req, res, next) {
  let {spotId} = req.params;
  let {user} = req;
  const spot = await Spot.findByPk(spotId);
  if(spot.ownerId !== user.id){
    const err = new Error("Forbidden");
    err.title = "Forbidden";
    err.errors = { message: "Forbidden"};
    err.status = 403;
    return next(err);
  }
  return next();
}

// If no current user, returns null
const currentUser = async function (req, res, next) {
  if(req.user) return next();
  else return res.json({ user: null });
}

// Checks that review exists
const reviewExists = async function(req, res, next) {
  let { reviewId } = req.params;
  let review = await Review.findByPk(reviewId);

  if(!review){
    const err = new Error("Review couldn't be found");
    err.title = "Review couldn't be found";
    err.errors = { message: "Review couldn't be found"};
    err.status = 404;
    return next(err);
  } else return next();
}

// Checks that the user owns the review
const reviewAuth = async function(req, res, next){
  let { reviewId } = req.params;
  let { user } = req;

  let review = await Review.findByPk(reviewId);
      if(review.userId !== user.id){
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden"};
        err.status = 403;
        return next(err);
      } else return next();

}
// Checks that a reviewImage exists
const reviewImageExists = async function(req, res, next){
  let { imageId } = req.params;

  let reviewImage = await ReviewImage.findByPk(imageId);
  if (!reviewImage){
    const err = new Error("Review Image couldn't be found");
    err.title = "Review Image couldn't be found";
    err.errors = { message: "Review Image couldn't be found"};
    err.status = 404;
    return next(err);
  } else return next();
}

// Checks that a user owns the review
const reviewImageAuth = async function(req, res, next) {
  let { user } = req;
  let { imageId } = req.params;

  let reviewImage = await ReviewImage.findByPk(imageId);
  let review = await Review.findByPk(reviewImage.reviewId);

    if(review.userId !== user.id){
      const err = new Error("Forbidden");
      err.title = "Forbidden";
      err.errors = { message: "Forbidden"};
      err.status = 403;
      return next(err);
    } else {
      return next();
    }

}

//Checks that a spotImage exists
const spotImageExists = async function(req, res, next){
  const { imageId } = req.params;

  let spotImage = await SpotImage.findOne({
    where: {
      id: imageId
    }
  });

  if(!spotImage){
    const err = new Error("Spot Image couldn't be found");
    err.title = "Spot Image couldn't be found";
    err.errors = { message: "Spot Image couldn't be found"};
    err.status = 404;
    return next(err);
  } else return next();
}




//Checks that a user owns a spotImage
const spotImageOwner = async function(req, res, next) {
  const { user } = req;
  const { imageId } = req.params;

  let spotImage = await SpotImage.findOne({
    where: {
      id: imageId
    }
  });

    let spotId = spotImage.dataValues.spotId
    let spot = await Spot.findByPk(spotId)
    if(spot.ownerId !== user.id){
      const err = new Error("Forbidden");
      err.title = "Forbidden";
      err.errors = { message: "Forbidden"};
      err.status = 403;
      return next(err);
     }

     return next();
}

//Checks if a user already has a review for a spot
const spotReviewAuth = async function (req, res, next){
  const { user } = req;
  const { spotId } = req.params
  let spot = await Spot.findByPk(spotId);
  let spotReviews = await spot.getReviews();

    spotReviews.forEach((review) =>{
      if(review.dataValues.userId === user.id){
        const err = new Error("User already has a review for this spot");
        err.title = "User already has a review for this spot";
        err.errors = { message: "User already has a review for this spot"};
        err.status = 500;
        return next(err);
      }
    })

    return next();

}

//Checks that a booking exists
const bookingExists = async function(req, res, next){
  const { bookingId } = req.params;
  let booking = await Booking.findOne({ where: {id: bookingId}})
  if(!booking){
    const err = new Error("Booking couldn't be found");
    err.title = "Booking couldn't be found";
    err.errors = { message: "Booking couldn't be found"};
    err.status = 404;
  }
  return next();
}

// Checks that the current booking hasn't been started
const bookingDateCurrent = async function(req, res, next){
  const { bookingId } = req.params;
  const { user } = req;
  let booking = await Booking.findOne({ where: {id: bookingId}})
  let date = new Date()
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = new Date(`${year}-${month}-${day}`)
  let bookingStartDate = new Date(booking.dataValues.startDate)


  if(date > bookingStartDate){
    const err = new Error("Bookings that have been started can't be deleted");
    err.title = "Bookings that have been started can't be deleted";
    err.errors = { message: "Bookings that have been started can't be deleted"};
    err.status = 403;
    return next(err);
  } else return next();
}




// Checks that the user owns the booking or if they own the spot
const bookingAuth = async function(req, res, next){
  const { bookingId } = req.params;
  const { user } = req;
  let booking = await Booking.findOne({ where: {id: bookingId}})

  let spotId = booking.spotId
  let spot = await Spot.findByPk(spotId)
  if(booking.userId !== user.id && spot.ownerId !== user.id){
    const err = new Error("Cannot delete a booking that is not your own.");
    err.title = "Cannot delete a booking that is not your own.";
    err.errors = { message: "Cannot delete a booking that is not your own."};
    err.status = 403;
    return next(err);

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


  if(spot.ownerId === user.id){
    const err = new Error("Cannot create booking a spot you own.");
    err.title = "Cannot create booking a spot you own.";
    err.errors = { message: "Cannot create booking a spot you own."};
    err.status = 403;
    return next(err);
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


    if((startDate >= bookedDate[0]) && !(startDate > bookedDate[1])){
     responseMessage.errors.startDate = "Start date conflicts with an existing booking"
    }
   if((startDate <= bookedDate[0]) && !(endDate < bookedDate[1])){
    responseMessage.errors.endDate = "End date conflicts with an existing booking"
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

const editBookingValid = async function (req, res, next) {
  let { bookingId } = req.params
  let { startDate, endDate } = req.body;
  let { user } = req;

  let date = new Date()
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`
  let currentBooking = await Booking.findByPk(bookingId);

  console.log(currentBooking.dataValues.endDate)

  if(currentDate > currentBooking.dataValues.endDate){
    res.statusCode = 403;
    res.json({
      message: "Past bookings can't be modified"
    })
    return;
  }
  let editBooking = await Booking.findOne({  where:{  id: bookingId } });
  let spotId = editBooking.spotId


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

module.exports = { bookingDateCurrent, bookingExists, spotImageExists, reviewImageExists, reviewExists, currentUser, spotExists, spotAuth, setTokenCookie, restoreUser, requireAuth, spotImageOwner, spotReviewAuth, reviewAuth, reviewImageAuth, bookingDateValid, bookingAuth, editBookingValid, };
