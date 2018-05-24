import { ITodo } from '../interfaces/itodo';
import { ITodoResource } from '../resources/todo.resources/itodo.resource';
import { todoFsResource } from '../resources/todo.resources/todo.fs.resource';
import { todoMongoResource } from '../resources/todo.resources/todo.mongo.resource';

export class TodoService {
  constructor(private todoResource: ITodoResource) {
  }

  public addTodo(todo: ITodo) {
    return this.todoResource.addTodo(todo)
      .then((result) => result);
  }

  public removeTodo(id: string, userId: string) {
    return this.todoResource.removeTodo(id, userId)
      .then((result) => result);
  }

  public removeAllTodos(userId: string) {
    return this.todoResource.removeAllTodos(userId)
      .then((result) => result);
  }

  public getAllTodos(userId: string, completed: boolean) {
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

  public changeComplete(id: string, userId: string, completed: boolean) {
    return this.todoResource.changeComplete(id, userId, completed)
      .then((result) => result);
  }
}

export const todoService = new TodoService(todoMongoResource);
