const app = require('../../app');
const expect = require('expect');
const supertest = require('supertest');

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
