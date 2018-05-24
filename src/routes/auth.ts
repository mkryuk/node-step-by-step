import * as express from 'express';
import { authController, AuthController } from '../controllers/auth.controller';
import { authMiddlware } from '../middlewares/auth.middleware';

class AuthRouter {
  constructor(private router: express.Router, private _authController: AuthController, private _authMiddlware: any) {
    this.router.route('/')
      // POST api/login
      .post(
        this._authMiddlware.localStrategy,
        this._authController.login.bind(this._authController));
  }
  get authRouter() {
    return this.router;
  }
}

export const authRouter = new AuthRouter(express.Router(), authController, authMiddlware).authRouter;
