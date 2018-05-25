import { NextFunction, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { IRequest } from '../interfaces/irequest';
import { IUser } from '../interfaces/iuser';
import { authMiddlware } from '../middlewares/auth.middleware';
import { TokenService } from '../services/token.service';
import { TYPES } from '../services/types';

@controller('/login')
export class AuthController {
  constructor(@inject(TYPES.TokenService) private _tokenService: TokenService) {
  }

  @httpPost('/', authMiddlware.localStrategy)
  public login(req: IRequest, res: Response, next: NextFunction) {
    return this._tokenService.createToken(req.user)
      .then((token) => {
        return res.status(200).json({
          success: true,
          token,
        });
      })
      .catch(next);
  }
}
