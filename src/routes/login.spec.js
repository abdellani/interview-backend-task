/* eslint-disable no-unused-expressions */
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { postHandler } from './login';

describe('login route handler', () => {
  let req;
  let res;
  let status;
  let json;
  let append;
  beforeEach(() => {
    status = sinon.spy();
    json = sinon.spy();
    append = sinon.spy();
    req = { body: '' };
    res = {
      append: (...arg) => {
        append(...arg);
        return { json };
      },
      status: (arg) => {
        status(arg);
        return { json };
      },
    };
  });
  it('should return HTTP 401 if username/password are invalid', () => {
    req.body = {
      username: 'username',
      password: 'invalidPassword',
    };
    postHandler(req, res);
    expect(status.calledOnce).to.be.true;
    expect(status.firstCall.args[0]).to.eql(401);
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({
      code: 401,
      error: 'Invalid username/password',
    });
  });
  it('should return HTTP 200 with authorization header if username/password are valid', () => {
    req.body = {
      username: 'admin',
      password: 'admin',
    };
    postHandler(req, res);

    expect(append.calledOnce).to.be.true;
    expect(append.firstCall.args[0]).to.eql('Authorization');
    expect(
      RegExp(
        '^Bearer [A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$',
      ).test(append.firstCall.args[1]),
    ).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({});
  });
});
