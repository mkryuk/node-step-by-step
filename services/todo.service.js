const { todoFsResource } = require('../resources/todo.resources/todo.fs.resource');

class TodoService {
  constructor(todoResource) {
    this.todoResource = todoResource;
  }

  addTodo(todo) {
    return this.todoResource.addTodo(todo)
      .then((result) => result);
  }
  removeTodo(id, userId) {
    return this.todoResource.removeTodo(id, userId)
      .then((result) => result);
  }
  removeAllTodos(userId) {
    return this.todoResource.removeAllTodos(userId)
      .then((result) => result);
  }
  getAllTodos(userId, completed) {
    return this.todoResource.getAllTodos(userId)
      .then((todos) => {
        let userTodos = todos;
        if (completed !== undefined && completed !== null) {
          userTodos = completed ?
            todos.filter((td) => td.completed === true) :
            todos.filter((td) => td.completed === false);
        }
        return userTodos;
      });
  }
  changeComplete(id, userId, completed) {
    return this.todoResource.changeComplete(id, userId, completed)
      .then((result) => result);
  }
}

module.exports = {
  TodoService,
  todoService: new TodoService(todoFsResource)
};
