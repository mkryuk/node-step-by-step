import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { authMiddlware } from '../middlewares/auth.middleware';
import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';

@controller('/users')
export class UserController {
  constructor(@inject(TYPES.UserService) private _userService: UserService) {
  }

  @httpGet('/')
  public getAllUsers(req: Request, res: Response, next: NextFunction) {
    return this._userService.getAllUsers()
      .then((users) => {
        const mappedUsers = users.map((user) => {
          return {
            id: user.id,
            name: user.name.first + ' ' + user.name.last,
          };
        });
        return res.json({
          users: mappedUsers,
        });
      })
      .catch(next);
  }

  @httpGet('/:id')
  public getUserById(req: Request, res: Response, next: NextFunction) {
    return this._userService.getUserById(req.params.id)
      .then((user) => {
        const userSafeData = {
          id: user.id,
          name: user.name.first + ' ' + user.name.last,
        };
        return res.json({
          user: userSafeData,
        });
      })
      .catch(next);
  }

  @httpGet('/:id/info', authMiddlware.bearerStrategy)
  public getUserInfo(req: Request, res: Response, next: NextFunction) {
    return this._userService.getUserById(req.params.id)
      .then((user) => {
        const userSafeData = {
          id: user.id,
          name: user.name.first + ' ' + user.name.last,
          age: user.age,
          company: user.company,
          email: user.email,
        };
        return res.json({
          user: userSafeData,
        });
      })
      .catch(next);
  }
}
