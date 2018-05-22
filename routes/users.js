const express = require('express');
const { authMiddlware } = require('../middlewares/auth.middleware');
const { userController } = require('../controllers/user.controller');

class UserRouter {
  constructor(router, userController, authMiddlware) {
    this.router = router;
    this.userController = userController;
    this.authMiddlware = authMiddlware;
    this.setupRouter();
  }
  get userRouter() {
    return this.router;
  }
  setupRouter() {
    this.router.route('/')
      // GET api/users
      .get(this.userController.getAllUsers.bind(this.userController));
    this.router.route('/:id')
      // GET api/users/:id
      .get(this.userController.getUserById.bind(this.userController));
    this.router.route('/:id/info')
      // GET api/users/:id/info
      .get(this.authMiddlware.bearerStrategy, 
        this.userController.getUserInfo.bind(this.userController));
  }
}

module.exports = {
  UserRouter,
  userRouter: new UserRouter(express.Router(), userController, authMiddlware).userRouter
};
