import { NextFunction, Request, Response } from 'express';
import { todoService, TodoService } from '../services/todo.service';

export class TodoController {
  constructor(private _todoService: TodoService) {
  }

  public getAllTodos(req: Request, res: Response, next: NextFunction) {
    const completed = req.query.completed !== undefined ? req.query.completed === 'true' : null;
    return this._todoService.getAllTodos(req.user.id, completed)
      .then((userTodos) => {
        return res.json({
          todos: userTodos,
        });
      })
      .catch(next);
  }

  public addTodo(req: Request, res: Response, next: NextFunction) {
    const _todo = req.body;
    _todo.userId = req.user.id;
    return this._todoService.addTodo(_todo)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }

  public removeTodo(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    return this._todoService.removeTodo(id, req.user.id)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }

  public changeComplete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    return this._todoService.changeComplete(id, req.user.id, req.body.completed)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }
}

export const todoController = new TodoController(todoService);
