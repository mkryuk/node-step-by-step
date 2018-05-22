const fs = require('fs');
const config = require('../../config')

class UserFsResource {
  constructor(fs, path) {
    this.fs = fs;
    this.path = path;
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === id);
      resolve(user);
    });
  }
  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data);
      const user = users.find((user) => user.email === email);
      resolve(user);
    });

  }
  getAllUsers() {
    return new Promise((resolve, reject) => {
      const data = this.fs.readFileSync(this.path, 'utf8');
      const users = JSON.parse(data);
      resolve(users || []);
    });
  }
}

module.exports = {
  UserFsResource,
  userFsResource: new UserFsResource(fs, config.FS_DATA_USERS_PATH)
};
