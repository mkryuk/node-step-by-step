import * as express from 'express';
import { userController, UserController } from '../controllers/user.controller';
import { AuthMiddleware, authMiddlware } from '../middlewares/auth.middleware';

export class UserRouter {
  constructor(private router: express.Router, private _userController: UserController, private _authMiddlware: AuthMiddleware) {
    this.setupRouter();
  }
  get userRouter() {
    return this.router;
  }
  private setupRouter() {
    this.router.route('/')
      // GET api/users
      .get(this._userController.getAllUsers.bind(this._userController));
    this.router.route('/:id')
      // GET api/users/:id
      .get(this._userController.getUserById.bind(this._userController));
    this.router.route('/:id/info')
      // GET api/users/:id/info
      .get(this._authMiddlware.bearerStrategy,
        this._userController.getUserInfo.bind(this._userController));
  }
}

export const userRouter = new UserRouter(express.Router(), userController, authMiddlware).userRouter;
