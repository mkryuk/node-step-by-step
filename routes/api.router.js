const express = require("express");
const { authRouter } = require('./auth');
const { todoRouter } = require('./todos');
const { userRouter } = require('./users');

class ApiRouter {
  constructor(router, routes) {
    this.router = router;
    this.routes = routes;
    this.setupApiRoutes(routes);
  }

  get apiRouter() {
    return this.router;
  }
  addApiRoute(url, router) {
    this.router.use(url, router);
  }
  setupApiRoutes(routes) {
    routes.forEach((route) => {
      this.addApiRoute(route.url, route.router);
    });
  }
}
const routes = [
  { url: '/login', router: authRouter },
  { url: '/todos', router: todoRouter },
  { url: '/users', router: userRouter },
];
module.exports = {
  ApiRouter,
  apiRouter: new ApiRouter(express.Router(), routes).apiRouter
};
