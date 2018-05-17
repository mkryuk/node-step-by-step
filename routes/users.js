var express = require('express');
var router = express.Router();
var fs = require('fs');
var passport = require('passport');

/**
 *  GET api/users
 */
router.get('/',
  function (req, res, next) {
    var data = fs.readFileSync('./data/users.json', 'utf8');
    var users = JSON.parse(data);
    var usersSafeData = users.map((user) => {
      return {
        id: user.id,
        name: user.name.first + ' ' + user.name.last
      };
    });
    res.json({
      users: usersSafeData
    });
  });

/**
 *  GET api/users/:id
 */
router.get('/:id',
  function (req, res, next) {
    var data = fs.readFileSync('./data/users.json', 'utf8');
    var users = JSON.parse(data);
    var user = users.find((user) => user.id === req.params.id);
    var userSafeData = {
      id: user.id,
      name: user.name.first + ' ' + user.name.last
    };
    res.json({
      user: userSafeData
    });
  });

/**
 *  GET api/users/:id/info
 */
router.get('/:id/info',
  passport.authenticate('bearer', {
    session: false
  }),
  function (req, res, next) {
    var data = fs.readFileSync('./data/users.json', 'utf8');
    var users = JSON.parse(data);
    var user = users.find((user) => user.id === req.params.id);
    var userSafeData = {
      id: user.id,
      name: user.name.first + ' ' + user.name.last,
      age: user.age,
      company: user.company,
      email: user.email
    };
    res.json({
      user: userSafeData
    });
  });

module.exports = router;
