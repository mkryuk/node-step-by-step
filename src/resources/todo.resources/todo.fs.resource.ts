import * as fs from 'fs';
import { injectable } from 'inversify';
import * as uuidv1 from 'uuid/v1';
import { config } from '../../config';
import { ITodo } from '../../interfaces/itodo';
import { ITodoResource } from './itodo.resource';

@injectable()
export class TodoFsResource implements ITodoResource {
  private path = config.FS_DATA_TODOS_PATH;

  public getAllTodos(userId: string) {
    return new Promise<ITodo[]>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const userTodos = todos.filter((td) => td.userId === userId);
      resolve(userTodos);
    });
  }

  public addTodo(todo: ITodo) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      todo.id = uuidv1();
      todos.push(todo);
      fs.writeFileSync(this.path, JSON.stringify(todos));
      resolve(todo);
    });
  }

  public removeTodo(id: string, userId: string) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const todo = todos.find((t) => t.id === id && t.userId === userId);
      const filteredTodos = todos.filter((t) => t.id !== todo.id);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos));
      resolve(todo);
    });
  }

  public removeAllTodos(userId: string) {
    return new Promise<ITodo[]>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const filteredTodos = todos.filter((todo) => todo.userId !== userId);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos));
      resolve(filteredTodos);
    });
  }

  public changeComplete(id: string, userId: string, completed: boolean) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const todo = todos.find((t) => t.id === id && t.userId === userId);
      todo.completed = completed;
      fs.writeFileSync(this.path, JSON.stringify(todos));
      resolve(todo);
    });
  }
}
