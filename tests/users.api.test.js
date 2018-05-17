var supertest = require('supertest');
var app = require('../app');
var expect = require('expect');

describe('/users API tests', () => {

  it('it should GET all users', (done) => {
    supertest(app).get('/api/users')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.body.error).toBe(undefined);
        expect(res.body.users).toBeDefined();
        done();
      });
  });

  it('should get single user', (done) => {
    supertest(app).get('/api/users/0')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.body.error).toBe(undefined);
        expect(res.body).toBeDefined();
        expect(res.body.user).toBeDefined();
        expect(res.body.user.id).toBe("0");
        done();
      });
  });

  describe('users authorized only section', () => {
    let token = '';
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
          done();
        });
    });

    it('should get single user full info', (done) => {
      supertest(app).get('/api/users/0/info')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(err).toEqual(null);
          expect(res.body.error).toBe(undefined);
          expect(res.body).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.id).toBe("0");
          done();
        });
    });
  });
});
