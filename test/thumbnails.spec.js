import {
  describe, before, after, it,
} from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import config from 'config';
import hasha from 'hasha';
import Path from 'path';
import imageServer from './mock/imagesServer';
import { generateJwtToken } from '../src/utilities';
import app from '../src/index';

chai.should();
chai.use(chaiHttp);

describe('/thumbnails', () => {
  let server;
  let invalidToken;
  let validToken;
  let validUrl;
  let invalidUrl;

  before(() => {
    validToken = generateJwtToken({ payload: { id: 1 } });
    invalidToken = generateJwtToken({ payload: { id: -1 } });
    server = imageServer.listen(config.get('IMAGE_SERVER_PORT'));
    validUrl = `http://localhost:${config.get('IMAGE_SERVER_PORT')}/image1.jpg`;
    invalidUrl = `http://localhost:${config.get(
      'IMAGE_SERVER_PORT',
    )}/invalid.file`;
  });

  it('should return a HTTP 401 if the token JWT is not set', (done) => {
    chai
      .request(app)
      .post('/thumbnails')
      .send({ url: validUrl })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
  it('should return a HTTP 401 if the JWT token is invalid', (done) => {
    chai
      .request(app)
      .post('/thumbnails')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ url: validUrl })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  describe('when user is authenticated', () => {
    it('should return url to the thumbnail ', (done) => {
      chai
        .request(app)
        .post('/thumbnails')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ url: validUrl })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('path');
          const { path } = res.body;
          const fileName = path.split('/')[2];
          hasha
            .fromFile(Path.join(config.get('IMAGE_DIR'), fileName), {
              algorithm: 'sha512',
            })
            .then((hash) => {
              expect(hash).to.be.eql(config.get('HASH_RESIZE_IMAGE'));
              done();
            });
        });
    });

    it('should return HTTP 500 if the url is invalid', (done) => {
      chai
        .request(app)
        .post('/thumbnails')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ url: invalidUrl })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
  after(() => {
    server.close();
  });
});
