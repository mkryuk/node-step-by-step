const { userService } = require('../services/user.service');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAllUsers(req, res, next) {
    return this.userService.getAllUsers()
      .then((users) => {
        const mappedUsers = users.map((user) => {
          return {
            id: user.id,
            name: user.name.first + ' ' + user.name.last
          };
        });
        return res.json({
          users: mappedUsers
        });
      })
      .catch(next);
  }
  getUserById(req, res, next) {
    return this.userService.getUserById(req.params.id)
      .then((user) => {
        const userSafeData = {
          id: user.id,
          name: user.name.first + ' ' + user.name.last
        };
        return res.json({
          user: userSafeData
        });
      })
      .catch(next);
  }
  getUserInfo(req, res, next) {
    return this.userService.getUserById(req.params.id)
      .then((user) => {
        const userSafeData = {
          id: user.id,
          name: user.name.first + ' ' + user.name.last,
          age: user.age,
          company: user.company,
          email: user.email
        };
        return res.json({
          user: userSafeData
        });
      });
  }
}

module.exports = {
  UserController,
  userController: new UserController(userService)
};
