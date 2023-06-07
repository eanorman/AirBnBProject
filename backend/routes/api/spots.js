const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');

const router = express.Router();


// Sign up
router.get('/', async (req, res) => {
    let spots = await Spot.findAll();
    res.json(spots)
});

module.exports = router;
