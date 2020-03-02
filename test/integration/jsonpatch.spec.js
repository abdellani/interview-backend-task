/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it, before } from 'mocha';
import app from '../../src/index';
import { generateJwtToken } from '../../src/utilities';

chai.should();
chai.use(chaiHttp);

describe('POST /jsonpatch', () => {
  let token;
  let invalidToken;
  let doc;
  let patch;
  let patchedDoc;

  before(() => {
    token = generateJwtToken({ payload: { id: 1 } });
    invalidToken = generateJwtToken({ payload: { id: -1 } });
    doc = {
      baz: 'qux',
      foo: 'bar',
    };
    patch = [{ op: 'replace', path: '/baz', value: 'boo' }];

    patchedDoc = {
      baz: 'boo',
      foo: 'bar',
    };
  });

  it('should return a HTTP 401 if the JWT token is not set ', (done) => {
    chai
      .request(app)
      .post('/jsonpatch')
      .send({ doc, patch })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should return a HTTP 401 if the JWT token is invalid', (done) => {
    chai
      .request(app)
      .post('/jsonpatch')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ doc, patch })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should return a patch doc if the JWT token is set ', (done) => {
    chai
      .request(app)
      .post('/jsonpatch')
      .set('Authorization', `Bearer ${token}`)
      .send({ doc, patch })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.eql(patchedDoc);
        done();
      });
  });

  it('should return HTTP 400 if invalid payload is sent', (done) => {
    chai
      .request(app)
      .post('/jsonpatch')
      .set('Authorization', `Bearer ${token}`)
      .send({ patch })
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.json;
        done();
      });
  });
});
