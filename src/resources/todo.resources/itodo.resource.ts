import { ITodo } from '../../interfaces/itodo';

export interface ITodoResource {
  addTodo(todo: ITodo): Promise<ITodo>;
  changeComplete(id: string, userId: string, completed: boolean): Promise<ITodo>;
  getAllTodos(userId: string): Promise<ITodo[]>;
  removeAllTodos(userId: string): Promise<ITodo[]>;
  removeTodo(id: string, userId: string): Promise<ITodo>;
}
