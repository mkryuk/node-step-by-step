import { IUser } from '../interfaces/iuser';
import { userFsResource, UserFsResource } from '../resources/user.resources/user.fs.resource';

export class UserService {
  constructor(private userResource: UserFsResource) {
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

export const userService = new UserService(userFsResource);
