const express = require('express');
const { authController } = require('../controllers/auth.controller');
const { authMiddlware } = require('../middlewares/auth.middleware');

class AuthRouter {
  constructor(router, authController, authMiddlware) {
    this.router = router;
    this.authController = authController;
    this.authMiddlware = authMiddlware;
    this.router.route('/')
      // POST api/login
      .post(
        this.authMiddlware.localStrategy,
        this.authController.login.bind(this.authController));
  }
  get authRouter() {
    return this.router;
  }
}

module.exports = {
  AuthRouter,
  authRouter: new AuthRouter(express.Router(), authController, authMiddlware).authRouter
};
