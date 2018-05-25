import * as expect from 'expect';
import * as supertest from 'supertest';
import { app } from '../../app';
import { ITodo } from '../../interfaces/itodo';
import { IUser } from '../../interfaces/iuser';
import { iocContainer } from '../../ioc/ioc.config';
import { TodoService } from '../../services/todo.service';
import { TokenService } from '../../services/token.service';
import { TYPES as ServicesTypes } from '../../services/types';
import { UserService } from '../../services/user.service';

const todoService = iocContainer.get<TodoService>(ServicesTypes.TodoService);
const tokenService = iocContainer.get<TokenService>(ServicesTypes.TokenService);
const userService = iocContainer.get<UserService>(ServicesTypes.UserService);

describe('/todos API tests', () => {

  describe('todos auth section', () => {
    let token: string;
    let user: IUser;
    let todo: ITodo;
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
          title: 'THIS IS A TEST DATA',
          completed: false,
          userId: user.id,
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
          title: 'THIS IS A TEST DATA',
          completed: false,
        })
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.todo).toBeDefined();
          expect(res.body.todo.title).toContain('THIS IS A TEST DATA');
          done();
        });
    });

    it('should update todo', (done) => {
      supertest(app).put('/api/todos/' + todo.id)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          completed: false,
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
