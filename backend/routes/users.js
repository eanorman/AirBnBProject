const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../utils/auth');
const { User } = require('../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  router.get(
    '/:userId', restoreUser,
    async (req, res) => {
      const { userId } = req.params;
      const { user } = req;
      if(user){
        res.json(user)
      } else {
        res.json({
          user: null
        })
      }
    }
  );

module.exports = router;
