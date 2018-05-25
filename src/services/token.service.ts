import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../interfaces/iuser';
@injectable()
export class TokenService {
  public createToken(user: IUser) {
    return new Promise<string>((resolve, reject) => {
      const token = jwt.sign({
        id: user.id,
        login: user.email,
      }, config.SECRET_TOKEN_KEY, {
          expiresIn: 86400,
        });
      resolve(token);
    });
  }
}
