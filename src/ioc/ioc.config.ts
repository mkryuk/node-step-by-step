import * as fs from 'fs';
import { Container } from 'inversify';
import { config } from '../config';
import { ITodoResource } from '../resources/todo.resources/itodo.resource';
import { TodoFsResource } from '../resources/todo.resources/todo.fs.resource';
import { TodoMongoResource } from '../resources/todo.resources/todo.mongo.resource';
import { UserFsResource } from '../resources/user.resources/user.fs.resource';
import { MongoConnectionService } from '../services/mongo.service';
import { TodoService } from '../services/todo.service';
import { TokenService } from '../services/token.service';

import { TYPES as MiddlewaresTypes } from '../middlewares/types';
import { TYPES as ResourcesTypes } from '../resources/types';
import { TYPES as ServicesTypes } from '../services/types';

import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';

const iocContainer = new Container();
// Constants
iocContainer
  .bind<MongoConnectionService>(ServicesTypes.MongoConnectionService)
  .toConstantValue(new MongoConnectionService(config.MONGO_CONNECTION_STRING));

// Resources
iocContainer.bind<ITodoResource>(ResourcesTypes.ITodoResource).to(TodoMongoResource);
// iocContainer.bind<ITodoResource>(ResourcesTypes.ITodoResource).to(TodoFsResource);
iocContainer.bind<UserFsResource>(ResourcesTypes.UserResource).to(UserFsResource);

// Services
iocContainer.bind<TodoService>(ServicesTypes.TodoService).to(TodoService);
iocContainer.bind<UserService>(ServicesTypes.UserService).to(UserService);
iocContainer.bind<TokenService>(ServicesTypes.TokenService).to(TokenService);

export { iocContainer };
