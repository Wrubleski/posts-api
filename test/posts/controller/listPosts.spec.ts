import { populate } from '../../../src/infrastructure/populateDatabase';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { listPosts } from '../../../src/controllers/posts/listPosts';

describe('Post Controller unit tests', () => {
  beforeAll(async () => {
    // Setup a database before running tests. Using in-memory mongodb server.
    await connect();
    await populate(Posts);
  });

  afterAll(async () => {
    // Stop the databse after running the tests
    await stop();
  });

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
