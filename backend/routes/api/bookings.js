const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { bookingSpot, bookingsSpotPreview } = require('../../utils/booking')

const { setTokenCookie, requireAuth, spotOwner, reviewAuth, reviewImageAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { getSpotImages } = require('../../utils/spot');


const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    })
    console.log(bookings)

    await bookingSpot(bookings);
    await bookingsSpotPreview(bookings);

    res.json(bookings)
})

module.exports = router;
