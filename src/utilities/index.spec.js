import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import JWT from 'jsonwebtoken';
import {
  checkCredentials,
  generateJwtToken,
  decryptJwtToken,
  isAutherizationHeaderPatternValid,
  isValidUserID,
} from './index';

describe('checkCredentials', () => {
  it('should return id if the username/password are valid', () => {
    expect(checkCredentials('admin', 'admin')).to.eql({ id: 1 });
  });
  it('should return null if the username/password are invalid', () => {
    expect(checkCredentials('admin', 'wrongPassword')).to.eql(null);
  });
});
describe('isValidUserID', () => {
  it('should return true if the ID exists in the database', () => {
    expect(isValidUserID(1)).to.eql(true);
  });
  it("should return false if the ID doesn't exist in the database", () => {
    expect(isValidUserID(-1)).to.eql(false);
  });
});
describe('isAutherizationHeaderPatternValid', () => {
  let payloadWithoutBearer;
  let payloadWithInvalidChars;
  let validPayload;

  before(() => {
    payloadWithoutBearer = 'test eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
      + 'eyJpZCI6MSwiaWF0IjoxNTgzMTA4NzcxLCJleHAiOjE1ODMxOTUxNzF9.'
      + '63n8zhAKK9c8rBaColFzTRbOIVZlGB9-CsEF320yB_U';
    payloadWithInvalidChars = 'Bearer àààà)====+++==-*/-*/*-/-*/+++###~~~~~.'
      + 'eyJpZCI6MSwiaWF0IjoxNTgzMTA4NzcxLCJleHAiOjE1ODMxOTUxNzF9.'
      + '63n8zhAKK9c8rBaColFzTRbOIVZlGB9-CsEF320yB_U';
    validPayload = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
      + 'eyJpZCI6MSwiaWF0IjoxNTgzMTA4NzcxLCJleHAiOjE1ODMxOTUxNzF9.'
      + '63n8zhAKK9c8rBaColFzTRbOIVZlGB9-CsEF320yB_U';
  });
  it('should retrun true if the header payload is valid ', () => {
    expect(isAutherizationHeaderPatternValid(validPayload)).to.eql(true);
  });
  it("should retrun false if the header payload doesn't start with 'Bearer ' ", () => {
    expect(isAutherizationHeaderPatternValid(payloadWithoutBearer)).to.eql(
      false,
    );
  });
  it('should retrun false if the header payload contains invalid chars ', () => {
    expect(isAutherizationHeaderPatternValid(payloadWithInvalidChars)).to.eql(
      false,
    );
  });
});

describe('decryptJwtToken', () => {
  let token;
  let secret;
  let payload;
  let clock;
  before(() => {
    clock = sinon.useFakeTimers();
    secret = 'superSecretPassword';
    payload = { id: 1 };
    const options = { expiresIn: '1h' };
    token = JWT.sign(payload, secret, options);
  });
  it('should generate the payload if token and secret are correct', () => {
    expect(decryptJwtToken({ token, secret })).to.include(payload);
  });
  it('should generate return null the payload if secret is incorrect', () => {
    const invalidSecret = 'wrongPassword';
    expect(decryptJwtToken({ token, secret: invalidSecret })).to.eql(null);
  });
  it('should generate return null the payload if the token is edited', () => {
    const invalidToken = `a${token}`;
    expect(decryptJwtToken({ token: invalidToken, secret })).to.eql(null);
  });

  it('should return null if token expires', () => {
    // As lifetime is 1h, the token should not work after 1h and 1m
    clock.tick(3600 * 1000 + 60 * 1000);
    expect(decryptJwtToken({ token, secret })).to.eql(null);
  });
});

describe('generateJwtToken', () => {
  let token;
  let secret;
  let payload;
  let clock;
  let options;
  before(() => {
    clock = sinon.useFakeTimers();
    clock.tick(0);
    secret = 'superSecretPassword';
    payload = { id: 1 };
    options = { expiresIn: '1h' };
    token = JWT.sign(payload, secret, options);
  });
  it('shoud generate a valid token', () => {
    expect(generateJwtToken({ payload, secret, options })).to.eql(token);
  });
});
