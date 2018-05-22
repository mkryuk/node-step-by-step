const { todoService } = require('../services/todo.service');

class TodoController {
  constructor(todoService) {
    this.todoService = todoService;
  }

  getAllTodos(req, res, next) {
    const completed = req.query.completed !== undefined ? req.query.completed === 'true' : null;
    return this.todoService.getAllTodos(req.user.id, completed)
      .then((userTodos) => {
        return res.json({
          todos: userTodos
        });
      })
      .catch(next);
  }
  addTodo(req, res, next) {
    const todo = req.body;
    todo.userId = req.user.id;
    return this.todoService.addTodo(todo)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }
  removeTodo(req, res, next) {
    const id = req.params.id;
    return this.todoService.removeTodo(id, req.user.id)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }
  changeComplete(req, res, next) {
    const id = req.params.id;
    return this.todoService.changeComplete(id, req.user.id, req.body.completed)
      .then((todo) => {
        return res.json({ todo });
      })
      .catch(next);
  }
}

module.exports = {
  TodoController,
  todoController: new TodoController(todoService)
};
