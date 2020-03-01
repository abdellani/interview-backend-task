import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/index';

chai.should();
chai.use(chaiHttp);

describe('/login', () => {
  it('should return a token if credentials are correct', done => {
    const credentials = {
      username: 'admin',
      password: 'admin',
    };
    chai
      .request(app)
      .post('/login')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.header(
          'Authorization',
          /^Bearer [A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/,
        );
        done();
      });
  });
  it('should not return a token if credentials are incorrect', done => {
    let credentials = {
      username: 'admin',
      password: 'wrongPassword',
    };
    chai
      .request(app)
      .post('/login')
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.not.have.header('Authorization');
        done();
      });
  });
});
