const { mongoConnectionService } = require('../../services/mongo.service');
const { todoSchema } = require('../../schemas/todo.schema');

class TodoMongoResource {
  constructor(mongoConnectionService, todoSchema) {
    this.Todo = mongoConnectionService.connection.model('Todo', todoSchema);
  }

  getAllTodos(userId) {
    return this.Todo.find({
        userId: userId
      })
      .then((todos) => {
        return todos.map((todo) => this.toTodoModel(todo));
      });
  }
  addTodo(todo) {
    return this.Todo.create(todo)
      .then((item) => {
        return this.toTodoModel(item);
      });
  }
  removeTodo(id, userId) {
    return this.Todo.findOne({
        _id: id,
        userId: userId
      })
      .then((todo) => {
        if(todo){
          todo.remove();
          return this.toTodoModel(todo);
        } else {
          return null;
        }
      });
  }
  removeAllTodos(userId) {
    return this.Todo.find({
        userId: userId
      })
      .then((result) => {
        return result.map((todo) => this.toTodoModel(todo));
      })
      .then((data) => {
        return this.Todo.remove({
            userId: userId
          })
          .then(() => {
            return data;
          });
      });
  }
  changeComplete(id, userId, completed) {
    return this.Todo.update({
        _id: id,
        userId: userId
      }, {
        completed: completed
      })
      .then((data) => {
        return this.Todo.findOne({
            _id: id,
            userId: userId
          })
          .then((result) => {
            return this.toTodoModel(result);
          });
      });
  }
  toTodoModel(obj) {
    return {
      id: obj._id,
      userId: obj.userId,
      completed: obj.completed,
      title: obj.title,
    };
  }
}

module.exports = {
  TodoMongoResource,
  todoMongoResource: new TodoMongoResource(mongoConnectionService, todoSchema)
};
