const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const usersRouter = require('./users')


// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

router.use('/api', apiRouter);
router.use('/users', usersRouter);

module.exports = router;
