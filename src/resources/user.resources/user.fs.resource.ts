import * as fs from 'fs';
import { config } from '../../config';
import { IUser } from '../../interfaces/iuser';

export class UserFsResource {
  constructor(private fileService: any, private path: string) {
  }

  public getUserById(id: string) {
    return new Promise<IUser>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      const user = users.find((u) => u.id === id);
      resolve(user);
    });
  }

  public getUserByEmail(email: string) {
    return new Promise<IUser>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      const user = users.find((u) => u.email === email);
      resolve(user);
    });

  }

  public getAllUsers() {
    return new Promise<IUser[]>((resolve, reject) => {
      const data = this.fileService.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      resolve(users || []);
    });
  }
}

export const userFsResource = new UserFsResource(fs, config.FS_DATA_USERS_PATH);
