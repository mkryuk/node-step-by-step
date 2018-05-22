const fs = require('fs');
const config = require('../../config')
const uuidv1 = require('uuid/v1');

class TodoFsResource {
  constructor(fs, path, idGenerator) {
    this.fs = fs;
    this.path = path;
    this.idGenerator = idGenerator;
  }

  getAllTodos(userId) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data);
      const userTodos = todos.filter((td) => td.userId === userId);
      resolve(userTodos);
    });
  }
  addTodo(todo) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data);
      todo.id = this.idGenerator();
      todos.push(todo);
      fs.writeFileSync(this.path, JSON.stringify(todos));
      resolve(todo);
    });
  }
  removeTodo(id, userId) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data);
      const todo = todos.find((todo) => todo.id === id && todo.userId === userId)
      const filteredTodos = todos.filter((t) => t.id !== todo.id);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos))
      resolve(todo);
    });
  }
  removeAllTodos(userId) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data);
      const filteredTodos = todos.filter((todo) => todo.userId !== userId);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos))
      resolve(filteredTodos);
    });
  }
  changeComplete(id, userId, completed) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data);
      const todo = todos.find((todo) => todo.id === id && todo.userId === userId)
      todo.completed = completed;
      fs.writeFileSync(this.path, JSON.stringify(todos))
      resolve(todo);
    });
  }
}

module.exports = {
  TodoFsResource,
  todoFsResource: new TodoFsResource(fs, config.FS_DATA_TODOS_PATH, uuidv1)
};
