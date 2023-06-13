const {  Spot, SpotImage } = require('../db/models');

//Adds spot information to a booking
const bookingSpot = async function(bookings) {
    await Promise.all(bookings.map(async (booking) => {
        let spotId = booking.spotId;
        let spot = await Spot.findByPk(spotId, {
        attributes: {
            exclude: ['updatedAt', 'createdAt', 'description']
        }
        });
        spot.dataValues.lat = parseFloat(spot.dataValues.lat);
        spot.dataValues.lng = parseFloat(spot.dataValues.lng);
        booking.dataValues.Spot = spot;
        return booking;
    }))
    return bookings
}

// Adds a previewImage to a booking
const bookingsSpotPreview = async function(bookings) {
    await Promise.all(bookings.map(async (booking)=> {
        let spotId = booking.spotId
        let preview = await SpotImage.findOne({
            where: {
                spotId,
                preview: true
            }
        })

        booking.dataValues.Spot.dataValues.previewImage = preview.dataValues.url;
        return booking;
    }))
    return bookings;
}

module.exports = {
    bookingSpot,
    bookingsSpotPreview
}
