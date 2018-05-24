import { Model, Schema } from 'mongoose';
import { ITodo } from '../../interfaces/itodo';
import { ITodoModel } from '../../interfaces/itodo.model';
import { todoSchema } from '../../schemas/todo.schema';
import { mongoConnectionService, MongoConnectionService } from '../../services/mongo.service';
import { ITodoResource } from './itodo.resource';

export class TodoMongoResource implements ITodoResource {
  private Todo: Model<ITodoModel>;
  constructor(_mongoConnectionService: MongoConnectionService, _todoSchema: Schema) {
    this.Todo = _mongoConnectionService.connection.model('Todo', _todoSchema);
  }

  public getAllTodos(userId: string) {
    return this.Todo.find({
      userId,
    })
      .then((todos) => {
        return todos.map((todo) => this.toTodoModel(todo));
      });
  }

  public addTodo(todo: ITodo) {
    return this.Todo.create(todo)
      .then((item) => {
        return this.toTodoModel(item);
      });
  }

  public removeTodo(id: string, userId: string) {
    return this.Todo.findOne({
      _id: id,
      userId,
    })
      .then((todo) => {
        if (todo) {
          todo.remove();
          return this.toTodoModel(todo);
        } else {
          return null;
        }
      });
  }

  public removeAllTodos(userId: string) {
    return this.Todo.find({
      userId,
    })
      .then((result) => {
        return result.map((todo) => this.toTodoModel(todo));
      })
      .then((data) => {
        return this.Todo.remove({
          userId,
        })
          .then(() => {
            return data;
          });
      });
  }

  public changeComplete(id: string, userId: string, completed: boolean) {
    return this.Todo.update({
      _id: id,
      userId,
    }, {
        completed,
      })
      .then((data) => {
        return this.Todo.findOne({
          _id: id,
          userId,
        })
          .then((result) => {
            return this.toTodoModel(result);
          });
      });
  }

  private toTodoModel(obj: ITodoModel): ITodo {
    return {
      id: obj._id,
      userId: obj.userId,
      completed: obj.completed,
      title: obj.title,
    };
  }
}

export const todoMongoResource = new TodoMongoResource(mongoConnectionService, todoSchema);
