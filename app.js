var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var todosRouter = require('./routes/todos');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

var fs = require('fs');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');

passport.use(new localStrategy({
  passwordField: 'password',
  usernameField: 'email',
}, (username, password, cb) => {
  var usersData = fs.readFileSync('./data/users.json', 'utf8');
  var users = JSON.parse(usersData);
  var user = users.find((user) => user.email === username && user.password === password);
  if (!user) {
    var err = new Error('authorization error');
    err.status = 401;
    return cb(err);
  }
  return cb(null, user);
}));

passport.use(new bearerStrategy(
  (token, cb) => {
    if (token) {
      // check if token is valid and not expired
      jwt.verify(token, "#tokenSecret#", (err, decoded) => {
        if (err) {
          return cb(err);
        }
        if (!decoded) {
          return cb(null, false);
        }
        var usersData = fs.readFileSync('./data/users.json', 'utf8');
        var users = JSON.parse(usersData);
        var user = users.find((user) => user.email === decoded.login);
        if (!user) {
          var err = new Error('user not found');
          err.status = 404;
          return cb();
        }
        return cb(null, user);
      });
    } else {
      return cb('No token provided');
    }
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Add static
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Add passport
 */

app.use(passport.initialize());

/** 
 * Todos router
 */
app.use('/api/todos', todosRouter);

/**
 * Users router
 */
app.use('/api/users', usersRouter);

/**
 * Auth router
 */
app.use('/api/login', authRouter);

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  var error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: error,
    message: err.message,
  });
});

module.exports = app;
