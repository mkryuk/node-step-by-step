import * as jsonwebtoken from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../interfaces/iuser';

export class TokenService {
  constructor(private jwt: any, private secretTokenKey: string) {
  }

  public createToken(user: IUser) {
    return new Promise<string>((resolve, reject) => {
      const token = this.jwt.sign({
        id: user.id,
        login: user.email,
      }, this.secretTokenKey, {
          expiresIn: 86400,
        });
      resolve(token);
    });
  }
}

export const tokenService = new TokenService(jsonwebtoken, config.SECRET_TOKEN_KEY);
