import { Document } from 'mongoose';
import { ITodo } from '../interfaces/itodo';

export interface ITodoModel extends ITodo, Document {
}
