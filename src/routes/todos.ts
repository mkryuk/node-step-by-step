import * as express from 'express';
import { todoController, TodoController } from '../controllers/todo.controller';
import { AuthMiddleware, authMiddlware } from '../middlewares/auth.middleware';

export class TodoRouter {
  constructor(private router: express.Router, private _todoController: TodoController, private _authMiddlware: AuthMiddleware) {
    this.setupRouter();
  }
  get todoRouter() {
    return this.router;
  }
  private setupRouter() {
    this.router.route('/')
      // GET api/todos
      .get(this._authMiddlware.bearerStrategy,
        this._todoController.getAllTodos.bind(this._todoController))
      // POST api/todos
      .post(this._authMiddlware.bearerStrategy,
        this._todoController.addTodo.bind(this._todoController));

    this.router.route('/:id')
      // DELETE api/todos/:id
      .delete(this._authMiddlware.bearerStrategy,
        this._todoController.removeTodo.bind(this._todoController))
      // PUT api/todos/:id
      .put(this._authMiddlware.bearerStrategy,
        this._todoController.changeComplete.bind(this._todoController));
  }
}

export const todoRouter = new TodoRouter(express.Router(), todoController, authMiddlware).todoRouter;
