import { getPostById } from '../../../src/controllers/posts/getPostById';
import { listPosts } from '../../../src/controllers/posts/listPosts';

describe('Post Controller unit tests', () => {
  let id: string;
  beforeAll(async () => {
    const mReq = { body: {}, query: { size: 5, index: 0 } } as any;
    const mRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    const mNext = jest.fn();
    await listPosts(mReq, mRes, mNext);
    id = mRes.send.mock.lastCall[0][0].id;
  });

  describe('getPostsById tests', () => {
    it('should return 200 with valid id', async () => {
      const mReq = { body: {}, params: { id: id } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await getPostById(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.send).toHaveBeenCalled();
    });

    it('should fail to get and call next with invalid id', async () => {
      const mReq = { body: {}, params: { id: '' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await getPostById(mReq, mRes, mNext);

      expect(mNext).toHaveBeenCalled();
    });

    it('should return 404 whem triyng to get a non-existent post', async () => {
      const mReq = { params: { id: 'abcdef123456abcdef123456' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await getPostById(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.send).toHaveBeenCalled();
    });
  });
});
