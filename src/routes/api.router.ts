import * as express from 'express';
import { authRouter } from './auth';
import { todoRouter } from './todos';
import { userRouter } from './users';

export interface IRoute {
  url: string;
  router: express.Router;
}

export class ApiRouter {
  constructor(private router: express.Router, private routes: IRoute[]) {
    this.setupApiRoutes(routes);
  }

  get apiRouter() {
    return this.router;
  }

  public addApiRoute(url: string, router: express.Router) {
    this.router.use(url, router);
  }

  public setupApiRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.addApiRoute(route.url, route.router);
    });
  }
}
const apiRoutes: IRoute[] = [
  { url: '/login', router: authRouter },
  { url: '/todos', router: todoRouter },
  { url: '/users', router: userRouter },
];

export const apiRouter = new ApiRouter(express.Router(), apiRoutes).apiRouter;
