/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import errorsHandler from './errorsHandler';

describe('errorsHandler', () => {
  it('should status code with empty json', () => {
    const errorCode = 500;
    const err = { status: errorCode };
    const status = sinon.spy();
    const json = sinon.spy();
    const res = {
      status: (arg) => {
        status(arg);
        return { json };
      },
    };
    const req = null;
    const next = null;
    errorsHandler(err, req, res, next);
    expect(status.calledOnce).to.be.true;
    expect(status.firstCall.args[0]).to.eql(errorCode);
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({});
  });
});
