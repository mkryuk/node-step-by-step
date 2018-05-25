import { Request } from 'express';
import { IUser } from './iuser';
export interface IRequest extends Request {
  user: IUser;
}
