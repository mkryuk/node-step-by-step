import { NextFunction, Request, Response } from 'express';
import { userService, UserService } from '../services/user.service';

export class UserController {
  constructor(private _userService: UserService) {
  }

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

export const userController = new UserController(userService);
