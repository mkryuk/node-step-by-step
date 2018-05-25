import * as fs from 'fs';
import { injectable } from 'inversify';
import { config } from '../../config';
import { IUser } from '../../interfaces/iuser';

@injectable()
export class UserFsResource {
  private path = config.FS_DATA_USERS_PATH;

  public getUserById(id: string) {
    return new Promise<IUser>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      const user = users.find((u) => u.id === id);
      resolve(user);
    });
  }

  public getUserByEmail(email: string) {
    return new Promise<IUser>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      const user = users.find((u) => u.email === email);
      resolve(user);
    });

  }

  public getAllUsers() {
    return new Promise<IUser[]>((resolve, reject) => {
      const data = fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data) as IUser[];
      resolve(users || []);
    });
  }
}
