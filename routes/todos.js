const express = require("express");
const { authMiddlware } = require('../middlewares/auth.middleware');
const { todoController } = require('../controllers/todo.controller');

class TodoRouter {
  constructor(router, todoController, authMiddlware) {
    this.router = router;
    this.todoController = todoController;
    this.authMiddlware = authMiddlware;
    this.setupRouter();
  }
  get todoRouter() {
    return this.router;
  }
  setupRouter() {
    this.router.route('/')
      // GET api/todos
      .get(this.authMiddlware.bearerStrategy, 
      this.todoController.getAllTodos.bind(this.todoController))
      // POST api/todos
      .post(this.authMiddlware.bearerStrategy, 
      this.todoController.addTodo.bind(this.todoController));
    this.router.route('/:id')
      // DELETE api/todos/:id
      .delete(this.authMiddlware.bearerStrategy, 
      this.todoController.removeTodo.bind(this.todoController))
      // PUT api/todos/:id
      .put(this.authMiddlware.bearerStrategy, 
      this.todoController.changeComplete.bind(this.todoController))
  }
}

module.exports = {
  TodoRouter,
  todoRouter: new TodoRouter(express.Router(), todoController, authMiddlware).todoRouter
};
