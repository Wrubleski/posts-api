import {
  paginationQueryValidator,
  postBodyValidator,
  postPathParamValidator,
} from '../../../../src/helpers/middlewares/validator';
import { missingTitlePayload, postPayload } from '../../utils/mocks';

describe('Validator unit tests', () => {
  describe('postPathParamValidator tests', () => {
    it('should return 400 whem id is not 24 hex characters', () => {
      const mReq = { params: { id: 'querty' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      postPathParamValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should call next whem id is valid', () => {
      const mReq = { params: { id: 'abcdef123456abcdef123456' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      postPathParamValidator(mReq, mRes, mNext);
      expect(mNext).toHaveBeenCalled();
    });
  });

  describe('postBodyValidator unit test', () => {
    it('should return 400 whem body is missing a required field', () => {
      const mReq = { body: missingTitlePayload } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      postBodyValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should call next whem a valid body is sent', () => {
      const mReq = { body: postPayload } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      postBodyValidator(mReq, mRes, mNext);
      expect(mNext).toHaveBeenCalled();
    });
  });

  describe('paginationQueryValidator', () => {
    it('should call next whem the size and index query params are valid', () => {
      const mReq = { query: { size: 5, index: 1 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mNext).toHaveBeenCalled();
    });
    it('should return 400 whem size is missing', () => {
      const mReq = { query: { index: 1 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 whem index is missing', () => {
      const mReq = { query: { size: 1 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 whem size is negative', () => {
      const mReq = { query: { size: -1, index: 0 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 whem size is string', () => {
      const mReq = { query: { size: 'asdasd', index: 0 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 whem index is string', () => {
      const mReq = { query: { size: 1, index: 'asdasd' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as any;
      const mNext = jest.fn();
      paginationQueryValidator(mReq, mRes, mNext);
      expect(mRes.status).toHaveBeenCalledWith(400);
    });
  });
});
