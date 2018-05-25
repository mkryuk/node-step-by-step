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

function PassportFactory(container: Container) {
  const userService = container.get<UserService>(ServicesTypes.UserService);
  const secretTokenKey = config.SECRET_TOKEN_KEY;

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

  return passport;
}

const passportMiddlware = PassportFactory(iocContainer);
const authLocal = passportMiddlware.authenticate('local', { session: false });
const authBearer = passportMiddlware.authenticate('bearer', { session: false });
export { passportMiddlware, authLocal, authBearer };
