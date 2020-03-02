/* eslint-disable no-unused-expressions */
import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { postHandler } from './jsonpatch';

describe('jsonpatch route handler', () => {
  let doc;
  let invalidDoc;
  let patch;
  let invalidPatch;
  let patchedDoc;

  before(() => {
    doc = {
      baz: 'qux',
      foo: 'bar',
    };
    invalidDoc = 'invalid doc !!!';
    patch = [{ op: 'replace', path: '/baz', value: 'boo' }];
    invalidPatch = [{ op: 'invalid op' }];
    patchedDoc = {
      baz: 'boo',
      foo: 'bar',
    };
  });
  it('return patched document if doc and patch are valid', () => {
    const req = {
      body: {
        doc,
        patch,
      },
    };
    const res = { json: sinon.spy() };
    postHandler(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.eql(patchedDoc);
  });
  it('return empty json object with HTTP status 400 if patch is not valid', () => {
    const req = {
      body: {
        doc,
        invalidPatch,
      },
    };
    const status = sinon.spy();
    const json = sinon.spy();
    const res = {
      status: (arg) => {
        status(arg);
        return { json };
      },
    };
    postHandler(req, res);
    expect(status.calledOnce).to.be.true;
    expect(status.firstCall.args[0]).to.eql(400);
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({});
  });
  it('return empty json object with HTTP status 400 if doc is not valid', () => {
    const req = {
      body: {
        invalidDoc,
        patch,
      },
    };
    const status = sinon.spy();
    const json = sinon.spy();
    const res = {
      status: (arg) => {
        status(arg);
        return { json };
      },
    };
    postHandler(req, res);
    expect(status.calledOnce).to.be.true;
    expect(status.firstCall.args[0]).to.eql(400);
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({});
  });
});
