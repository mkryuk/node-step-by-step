var supertest = require('supertest');
var app = require('../app');
var expect = require('expect');

describe('/login API tests', () => {

  it('it should get login token', (done) => {
    supertest(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({
        email: "bradley.dixon@vitricomp.domain",
        password: "5af56ea3f28875f68912b648"
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeDefined();
        expect(res.body.token).toBeDefined();
        done();
      });
  });

  it('it should not get login token', (done) => {
    supertest(app)
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send({
        email: "wrong@email.com",
        password: "wrongpassword"
      })
      .expect(401)
      .end((err, res) => {
        expect(res.error).toBeDefined();
        done();
      });
  });
});
