import * as fs from 'fs';
import * as uuidv1 from 'uuid/v1';
import { config } from '../../config';
import { ITodo } from '../../interfaces/itodo';
import { ITodoResource } from './itodo.resource';

export class TodoFsResource implements ITodoResource {
  constructor(private fileService: any, private path: string, private idGenerator: any) {
    this.fileService = fileService;
    this.path = path;
    this.idGenerator = idGenerator;
  }

  public getAllTodos(userId: string) {
    return new Promise<ITodo[]>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const userTodos = todos.filter((td) => td.userId === userId);
      resolve(userTodos);
    });
  }

  public addTodo(todo: ITodo) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      todo.id = this.idGenerator();
      todos.push(todo);
      fs.writeFileSync(this.path, JSON.stringify(todos));
      resolve(todo);
    });
  }

  public removeTodo(id: string, userId: string) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const todo = todos.find((t) => t.id === id && t.userId === userId);
      const filteredTodos = todos.filter((t) => t.id !== todo.id);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos));
      resolve(todo);
    });
  }

  public removeAllTodos(userId: string) {
    return new Promise<ITodo[]>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const filteredTodos = todos.filter((todo) => todo.userId !== userId);
      fs.writeFileSync(this.path, JSON.stringify(filteredTodos));
      resolve(filteredTodos);
    });
  }

  public changeComplete(id: string, userId: string, completed: boolean) {
    return new Promise<ITodo>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const todos = JSON.parse(data) as ITodo[];
      const todo = todos.find((t) => t.id === id && t.userId === userId);
      todo.completed = completed;
      fs.writeFileSync(this.path, JSON.stringify(todos));
      resolve(todo);
    });
  }
}

export const todoFsResource = new TodoFsResource(fs, config.FS_DATA_TODOS_PATH, uuidv1);
