import { populate } from '../../../src/infrastructure/populateDatabase';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { listPosts } from '../../../src/controllers/posts/listPosts';
import { deletePost } from '../../../src/controllers/posts/deletePost';

describe('Post Controller unit tests', () => {
  let id: string;
  beforeAll(async () => {
    // Setup a database before running tests. Using in-memory mongodb server.
    await connect();
    await populate(Posts);
    const mReq = { body: {}, query: { size: 5, index: 0 } } as any;
    const mRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    const mNext = jest.fn();
    await listPosts(mReq, mRes, mNext);
    id = mRes.send.mock.lastCall[0][0].id;
  });

  afterAll(async () => {
    // Stop the databse after running the tests
    await stop();
  });
  describe('deletePost tests', () => {
    it('should fail to delete with invalid id', async () => {
      const mReq = {
        body: {},
        params: { id: 'abcdef123456abcdef123456' },
      } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await deletePost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.send).toHaveBeenCalledWith({
        error: 'Not Found',
        from: 'posts-api',
        timestamp: expect.anything(),
      });
    });

    it('should return 204 to whem post is deleted', async () => {
      const mReq = { body: {}, params: { id: id } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await deletePost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(204);
      expect(mRes.send).toHaveBeenCalled();
    });
  });
});
