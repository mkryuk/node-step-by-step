var supertest = require('supertest');
var app = require('../app');
var expect = require('expect');

describe('/todos API tests', () => {

  describe('todos auth section', () => {
    let token = '';
    let todo = {};
    beforeEach((done) => {
      supertest(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          email: "bradley.dixon@vitricomp.domain",
          password: "5af56ea3f28875f68912b648"
        })
        .end((err, res) => {
          token = res.body.token;
          supertest(app).post('/api/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
              "title": "THIS IS A TEST DATA",
              "completed": false
            })
            .end((err, res) => {
              todo = res.body.todo;
              done();
            });
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
  });
});
