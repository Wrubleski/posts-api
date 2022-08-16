import { listPosts } from '../../../src/controllers/posts/listPosts';

describe('Post Controller unit tests', () => {
  describe('listPosts tests', () => {
    it('should return five posts whem size query param is five', async () => {
      const mReq = { body: {}, query: { size: 5, index: 0 } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await listPosts(mReq, mRes, mNext);
      expect(mRes.send).toHaveBeenCalled();
      expect(mRes.send.mock.lastCall[0]).toHaveLength(5);
    });
  });
});
