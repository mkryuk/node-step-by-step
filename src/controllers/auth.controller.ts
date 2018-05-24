import { NextFunction, Request, Response } from 'express';
import { IUser } from '../interfaces/iuser';
import { TokenService, tokenService } from '../services/token.service';

export class AuthController {
  constructor(private _tokenService: TokenService) {
  }

  public login(req: Request, res: Response, next: NextFunction) {
    return this._tokenService.createToken(req.user as IUser)
      .then((token) => {
        return res.status(200).json({
          success: true,
          token,
        });
      })
      .catch(next);
  }
}

export const authController = new AuthController(tokenService);
