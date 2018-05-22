const { userFsResource } = require('../resources/user.resources/user.fs.resource');

class UserService {
  constructor(userResource) {
    this.userResource = userResource;
  }

  getUserById(id) {
    return this.userResource.getUserById(id)
      .then((user) => {
        return user;
      });
  }
  getUserByEmail(email) {
    return this.userResource.getUserByEmail(email)
      .then((user) => {
        return user;
      });
  }
  getAllUsers() {
    return this.userResource.getAllUsers()
      .then((users) => {
        return users;
      });
  }
}

module.exports = {
  UserService,
  userService: new UserService(userFsResource)
};
