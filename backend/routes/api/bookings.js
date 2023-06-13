const express = require('express');
const { bookingSpot, bookingsSpotPreview } = require('../../utils/booking')
const { validBookingEditDate, bookingDateCurrentEdit, bookingDateCurrent, bookingExists, bookingAuth, editBookingValid, editBookingUser, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');


const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
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
router.put('/:bookingId', requireAuth, bookingExists, bookingAuth, editBookingUser, validBookingEditDate, bookingDateCurrentEdit, editBookingValid, async (req, res) => {
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
router.delete('/:bookingId', requireAuth, bookingExists, bookingAuth, bookingDateCurrent, async(req, res) => {
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
