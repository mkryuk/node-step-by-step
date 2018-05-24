import * as expect from 'expect';
import * as supertest from 'supertest';
import { app } from '../../app';
import { tokenService } from '../../services/token.service';
import { userService } from '../../services/user.service';

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
        expect(res.body.user.id).toBe('0');
        done();
      });
  });

  describe('users authorized only section', () => {
    let token = '';
    beforeEach((done) => {
      userService.getUserById('0')
      .then((user) => {
        return user;
      })
      .then((user) => tokenService.createToken(user))
      .then((_token) => {
        token = _token;
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
          expect(res.body.user.id).toBe('0');
          done();
        });
    });
  });
});
