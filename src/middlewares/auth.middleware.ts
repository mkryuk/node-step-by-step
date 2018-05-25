import { Container } from 'inversify';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';
import { config } from '../config';
import { IUser } from '../interfaces/iuser';
import { iocContainer } from '../ioc/ioc.config';
import { TYPES as ServicesTypes } from '../services/types';
import { UserService } from '../services/user.service';

export class AuthMiddleware {
  public localStrategy: any;
  public bearerStrategy: any;
  public passportMiddleware: any;

  constructor(container: Container, secretTokenKey: string) {
    const userService = container.get<UserService>(ServicesTypes.UserService);
    const localStrategy = new LocalStrategy({
      passwordField: 'password',
      usernameField: 'email',
    }, (username: string, password: string, cb: any) => {
      return userService.getUserByEmail(username)
        .then((user) => {
          if (!user || user.password !== password) {
            return cb(new Error('user not found'));
          }
          return cb(null, user);
        });
    });

    const bearerStrategy = new BearerStrategy(
      (token: string, cb: any) => {
        jwt.verify(token, secretTokenKey, (err: any, decoded: IUser) => {
          if (err) {
            return cb(err);
          }
          if (!decoded) {
            return cb(null, false);
          }
          return userService.getUserById(decoded.id)
            .then(((user) => {
              if (!user) {
                return cb(new Error('user not found'));
              }
              return cb(null, user);
            }));
        });
      });

    passport.use(localStrategy);
    passport.use(bearerStrategy);
    this.localStrategy = passport.authenticate('local', {
      session: false,
    });
    this.bearerStrategy = passport.authenticate('bearer', {
      session: false,
    });
    this.passportMiddleware = passport.initialize();
  }
}

export const authMiddlware = new AuthMiddleware(iocContainer, config.SECRET_TOKEN_KEY);
