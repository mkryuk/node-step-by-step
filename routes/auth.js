var express = require('express');
var router = express.Router();
var fs = require('fs');
var passport = require('passport');
var jwt = require('jsonwebtoken');

/**
 * POST api/login
 */
router.post('/',
  passport.authenticate('local', {
    session: false
  }),
  function (req, res, next) {
    if (!req.user) {
      throw new Error('user credentials empty');
    }
    const token = jwt.sign({
      id: req.user.id,
      login: req.user.email,
    }, "#tokenSecret#", {
      expiresIn: 86400,
    });
    return res.status(200).json({
      success: true,
      token,
    });
  });

module.exports = router;
