/* eslint-disable no-unused-expressions */
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import Jimp from 'jimp/es';
import { postHandler } from './thumbnails';

describe('thumbnails route handler', () => {
  let status;
  let json;
  let req;
  let res;
  beforeEach(() => {
    status = sinon.spy();
    json = sinon.spy();
    req = { body: {} };
    res = {
      status: (arg) => {
        status(arg);
        return { json };
      },
    };
  });
  it("should return HTTP 400 if the payload doesn't contain url", () => {
    req.body = {};
    postHandler(req, res);
    expect(status.calledOnce).to.be.true;
    expect(status.firstCall.args[0]).to.eql(400);
    expect(json.calledOnce).to.be.true;
    expect(json.firstCall.args[0]).to.eql({ message: 'url is required !' });
  });
  it("should return HTTP 500 if url doens't refer to a valid image", (done) => {
    req.body = { url: 'http://non/existing/image/url' };
    sinon.stub(Jimp, 'read').callsFake(
      () => new Promise(() => {
        throw new Error('error');
      }),
    );
    postHandler(req, res).then(() => {
      expect(status.calledOnce).to.be.true;
      expect(status.firstCall.args[0]).to.eql(500);
      expect(json.calledOnce).to.be.true;
      Jimp.read.restore();
      done();
    });
  });
});
