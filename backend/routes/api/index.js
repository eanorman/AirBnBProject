const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImageRouter = require('./spotImages.js');
const reviewRouter = require('./reviews.js');
const reviewImageRouter = require('./reviewImages.js');
const bookingRouter = require('./bookings.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/spot-images', spotImageRouter)
router.use('/reviews', reviewRouter)
router.use('/review-images', reviewImageRouter)
router.use('/bookings', bookingRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});




module.exports = router;
