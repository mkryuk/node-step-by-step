const app = require('../../app');
const expect = require('expect');
const { userFsResource } = require('../../resources/user.resources/user.fs.resource');
const { UserService } = require('../../services/user.service');

describe('user service tests', () => {
  const userService = new UserService(userFsResource);

  it('should get all users', (done) => {
    userService.getAllUsers()
    .then((users) => {
      expect(users).toBeDefined();
      expect(users.length).toBeDefined();
      done();
    })
  });

  it('should get user by id', (done) => {
    userService.getUserById('0')
    .then((user) => {
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.id).toBe('0');
      done();
    });
  });

  it('should get user by email', (done) => {
    userService.getUserByEmail('bradley.dixon@vitricomp.domain')
    .then((user) => {
      expect(user).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.email).toBe('bradley.dixon@vitricomp.domain');
      done();
    });
  });
});
