import { populate } from '../../../src/infrastructure/populateDatabase';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { listPosts } from '../../../src/controllers/posts/listPosts';
import { updatePost } from '../../../src/controllers/posts/updatePost';
import { postPayload } from '../utils/mocks';

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

  describe('updatePost tests', () => {
    it('should fail to update with empty body and invalid id', async () => {
      const mReq = { body: {}, params: { id: '' } } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await updatePost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(404);
      expect(mRes.send).toHaveBeenCalledWith({
        error: 'Not Found',
        from: 'posts-api',
        timestamp: expect.anything(),
      });
    });

    it('should update whem body and id are valid', async () => {
      const mReq = {
        body: { ...postPayload, title: 'foo' },
        params: { id: id },
      } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await updatePost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.send).toHaveBeenCalled();
      expect(mRes.send.mock.lastCall[0].title).toBe('foo');
    });
  });
});
