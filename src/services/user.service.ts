import { inject, injectable } from 'inversify';
import { IUser } from '../interfaces/iuser';
import { TYPES } from '../resources/types';
import { UserFsResource } from '../resources/user.resources/user.fs.resource';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserResource) private userResource: UserFsResource) {
  }

  public getUserById(id: string) {
    return this.userResource.getUserById(id)
      .then((user) => {
        return user;
      });
  }

  public getUserByEmail(email: string) {
    return this.userResource.getUserByEmail(email)
      .then((user) => {
        return user;
      });
  }

  public getAllUsers() {
    return this.userResource.getAllUsers()
      .then((users) => {
        return users;
      });
  }
}
