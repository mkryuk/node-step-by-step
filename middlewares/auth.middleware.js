const { userService } = require('../services/user.service');
const config = require('../config');
const jwt = require('jsonwebtoken');
const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

class AuthMiddleware {
  constructor(userService, secretTokenKey, passport, jwt, LocalStrategy, BearerStrategy) {
    const localStrategy = new LocalStrategy({
      passwordField: 'password',
      usernameField: 'email',
    }, (username, password, cb) => {
      return userService.getUserByEmail(username)
        .then((user) => {
          if (!user || user.password !== password) {
            return cb(new Error('user not found'));
          }
          return cb(null, user);
        });
    });

    const bearerStrategy = new BearerStrategy(
      (token, cb) => {
        jwt.verify(token, secretTokenKey, (err, decoded) => {
          if (err) {
            return cb(err);
          }
          if (!decoded) {
            return cb(null, false);
          }
          return userService.getUserById(decoded.id)
            .then((user => {
              if (!user) {
                return cb(new Error('user not found'));
              }
              return cb(null, user);
            }))
        });
      });

    passport.use(localStrategy);
    passport.use(bearerStrategy);
    this.localStrategy = passport.authenticate('local', {
      session: false
    });
    this.bearerStrategy = passport.authenticate('bearer', {
      session: false
    });
    this.passportMiddleware = passport.initialize();
  }
}

const authMiddlware = new AuthMiddleware(userService, config.SECRET_TOKEN_KEY, passport, jwt, LocalStrategy, BearerStrategy);

module.exports = {
  AuthMiddleware,
  authMiddlware,
};
