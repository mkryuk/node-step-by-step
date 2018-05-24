import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';
import { config } from '../config';
import { IUser } from '../interfaces/iuser';
import { userService, UserService } from '../services/user.service';

export class AuthMiddleware {
  public localStrategy: any;
  public bearerStrategy: any;
  public passportMiddleware: any;

  constructor(
    _userService: UserService,
    _secretTokenKey: string,
    _passport: passport.PassportStatic,
    _jwt: any,
    _LocalStrategy: any,
    _BearerStrategy: any,
  ) {
    const localStrategy = new _LocalStrategy({
      passwordField: 'password',
      usernameField: 'email',
    }, (username: string, password: string, cb: any) => {
      return _userService.getUserByEmail(username)
        .then((user) => {
          if (!user || user.password !== password) {
            return cb(new Error('user not found'));
          }
          return cb(null, user);
        });
    });

    const bearerStrategy = new _BearerStrategy(
      (token: string, cb: any) => {
        _jwt.verify(token, _secretTokenKey, (err: any, decoded: IUser) => {
          if (err) {
            return cb(err);
          }
          if (!decoded) {
            return cb(null, false);
          }
          return _userService.getUserById(decoded.id)
            .then(((user) => {
              if (!user) {
                return cb(new Error('user not found'));
              }
              return cb(null, user);
            }));
        });
      });

    _passport.use(localStrategy);
    _passport.use(bearerStrategy);
    this.localStrategy = _passport.authenticate('local', {
      session: false,
    });
    this.bearerStrategy = _passport.authenticate('bearer', {
      session: false,
    });
    this.passportMiddleware = _passport.initialize();
  }
}

export const authMiddlware = new AuthMiddleware(userService, config.SECRET_TOKEN_KEY, passport, jwt, LocalStrategy, BearerStrategy);
