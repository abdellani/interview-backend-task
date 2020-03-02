import {
  describe, it, before, beforeEach,
} from 'mocha';
import sinon from 'sinon';
import config from 'config';
import { expect } from 'chai';
import JWT from 'jsonwebtoken';
import jwtTokensHandler from './jwtTokensHandler';

describe('jwtTokensHandler', () => {
  let req;
  let res;
  let json;
  let status;
  let next;
  beforeEach(() => {
    req = { headers: {} };
    status = sinon.spy();
    json = sinon.spy();
    next = sinon.spy();
    res = {
      status: (args) => {
        status(args);
        return { json };
      },
    };
  });
  describe('Requests without authorization header', () => {
    beforeEach(() => {
      req = { headers: {} };
    });
    it('should return status 401 if Authorization is not included in the header', () => {
      jwtTokensHandler(req, res, next);
      expect(status.calledOnce).to.eql(true);
      expect(status.firstCall.args[0]).to.eql(401);
      expect(json.calledOnce).to.eql(true);
      expect(json.firstCall.args[0]).to.eql({
        status: 401,
        message: 'Authorization header is required!',
      });
      expect(next.notCalled).to.eql(true);
    });
  });
  describe('Requests with authorization header', () => {
    let invalidAuthorizationPayload;
    let invalidAuthorizationToken;
    let validAuthorizationPayload;
    let token;
    before(() => {
      const secret = config.get('JWT_SECRET');
      const payload = { id: 1 };
      const options = { expiresIn: '1h' };
      token = JWT.sign(payload, secret, options);

      invalidAuthorizationPayload = 'Invalid payload !';
      invalidAuthorizationToken = `Bearer a${token}`;
      validAuthorizationPayload = `Bearer ${token}`;
    });
    beforeEach(() => {
      req = { headers: { authorization: '' } };
    });
    it('should return status 401 if Authorization header payload is not valid', () => {
      req.headers.authorization = invalidAuthorizationPayload;
      jwtTokensHandler(req, res, next);
      expect(status.calledOnce).to.eql(true);
      expect(status.firstCall.args[0]).to.eql(401);
      expect(json.calledOnce).to.eql(true);
      expect(json.firstCall.args[0]).to.eql({
        status: 401,
        message: 'Invalid Authorization header payload!',
      });
      expect(next.notCalled).to.eql(true);
    });
    it('should return status 401 if Authorization header token is not valid', () => {
      req.headers.authorization = invalidAuthorizationToken;
      jwtTokensHandler(req, res, next);
      expect(status.calledOnce).to.eql(true);
      expect(status.firstCall.args[0]).to.eql(401);
      expect(json.calledOnce).to.eql(true);
      expect(json.firstCall.args[0]).to.eql({
        status: 401,
        message: 'Invalid Token!',
      });
      expect(next.notCalled).to.eql(true);
    });
    it('should return status 200 if Authorization header token is valid', () => {
      req.headers.authorization = validAuthorizationPayload;
      jwtTokensHandler(req, res, next);
      expect(status.notCalled).to.eql(true);
      expect(json.notCalled).to.eql(true);
      expect(next.calledOnce).to.eql(true);
    });
  });
});
