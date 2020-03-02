/* eslint-disable no-unused-expressions */
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { ImageResizingException, FileWritingException } from './Exceptions';

describe('ImageResizingException', () => {
  let errorMessage;
  before(() => {
    errorMessage = 'Error message';
  });
  it('should return the error message', () => {
    try {
      throw new ImageResizingException(errorMessage);
    } catch (err) {
      expect(err instanceof ImageResizingException).to.be.true;
      expect(err.message).to.eql(errorMessage);
    }
  });
});

describe('FileWritingException', () => {
  let errorMessage;
  before(() => {
    errorMessage = 'Error message';
  });
  it('should return the error message', () => {
    try {
      throw new FileWritingException(errorMessage);
    } catch (err) {
      expect(err instanceof FileWritingException).to.be.true;
      expect(err.message).to.eql(errorMessage);
    }
  });
});
