const app = require('../../app');
const expect = require('expect');
const supertest = require('supertest');
const { todoService } = require('../../services/todo.service');
const { tokenService } = require('../../services/token.service');
const { userService } = require('../../services/user.service');

describe('/todos API tests', () => {

  describe('todos auth section', () => {
    let token = '';
    let user = {};
    let todo = {};
    beforeEach((done) => {
      userService.getUserById('0')
        .then((_user) => {
          user = _user;
        })
        .then(() => tokenService.createToken(user))
        .then((_token) => {
          token = _token;
        })
        .then(() => todoService.addTodo({
          "title": "THIS IS A TEST DATA",
          "completed": false,
          "userId": user.id
        }))
        .then((_todo) => {
          todo = _todo;
          done();
        });
    });

    afterEach((done) => {
      todoService.removeAllTodos(user.id)
        .then(() => {
          done();
        });
    });

    it('should get all todos', (done) => {
      supertest(app).get('/api/todos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.todos).toBeDefined();
          done();
        });
    });

    it('should create new todo', (done) => {
      supertest(app).post('/api/todos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          "title": "THIS IS A TEST DATA",
          "completed": false
        })
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.todo).toBeDefined();
          expect(res.body.todo.title).toContain("THIS IS A TEST DATA");
          done();
        });
    });

    it('should update todo', (done) => {
      supertest(app).put('/api/todos/' + todo.id)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          "completed": false
        })
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.todo).toBeDefined();
          expect(res.body.todo.completed).toBe(false);
          done();
        });
    });

    it('should delete todo', (done) => {
      supertest(app).delete('/api/todos/' + todo.id)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.todo).toBeDefined();
          expect(res.body.todo.completed).toBe(false);
          done();
        });
    });
  });
});
