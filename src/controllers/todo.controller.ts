import { NextFunction, Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpDelete, httpGet, httpPost, httpPut,
} from 'inversify-express-utils';
import { IRequest } from '../interfaces/irequest';
import { authMiddlware } from '../middlewares/auth.middleware';
import { TodoService } from '../services/todo.service';
import { TYPES } from '../services/types';

@controller('/todos')
export class TodoController {
  constructor(@inject(TYPES.TodoService) private _todoService: TodoService) {
  }

  @httpGet('/', authMiddlware.bearerStrategy)
  public getAllTodos(req: IRequest, res: Response, next: NextFunction) {
    const completed = req.query.completed !== undefined ? req.query.completed === 'true' : null;
    return this._todoService.getAllTodos(req.user.id, completed)
      .then((userTodos) => {
        return res.json({
          todos: userTodos,
        });
      })
      .catch(next);
  }

  @httpPost('/', authMiddlware.bearerStrategy)
  public addTodo(req: IRequest, res: Response, next: NextFunction) {
    const _todo = req.body;
    _todo.userId = req.user.id;
    return this._todoService.addTodo(_todo)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }

  @httpDelete('/:id', authMiddlware.bearerStrategy)
  public removeTodo(req: IRequest, res: Response, next: NextFunction) {
    const id = req.params.id;
    return this._todoService.removeTodo(id, req.user.id)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }

  @httpPut('/:id', authMiddlware.bearerStrategy)
  public changeComplete(req: IRequest, res: Response, next: NextFunction) {
    const id = req.params.id;
    return this._todoService.changeComplete(id, req.user.id, req.body.completed)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }
}
