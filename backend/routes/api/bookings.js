const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const  sequelize  = require('sequelize')
const { bookingSpot, bookingsSpotPreview } = require('../../utils/booking')

const { bookingAuth, editBookingValid, bookingDateValid, setTokenCookie, requireAuth, spotOwner, reviewAuth, reviewImageAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { getSpotImages } = require('../../utils/spot');
const req = require('express/lib/request');


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

    res.json({Bookings: bookings})
})

// Edit a booking
router.put('/:bookingId', requireAuth, editBookingValid, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { user } = req;
    const { bookingId } = req.params

    const booking = await Booking.findByPk(bookingId);

    const spotId = parseInt(booking.spotId);

    const editedBooking = await booking.update({
        bookingId,
        spotId,
        userId: user.id,
        startDate,
        endDate,
        updatedAt: new Date()
    })

    return res.json(editedBooking)

})

// Delete a booking
router.delete('/:bookingId', requireAuth, bookingAuth, async(req, res, next) => {
    let { bookingId } = req.params

    await Booking.destroy({
        where: {
            id: bookingId
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
