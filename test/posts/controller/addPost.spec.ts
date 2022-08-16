import { populate } from '../../../src/infrastructure/populateDatabase';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { missingTitlePayload, postPayload } from '../utils/mocks';
import { addPost } from '../../../src/controllers/posts/addPost';

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

  describe('addPost test', () => {
    it('should fail to save with empty body', async () => {
      const mReq = { body: {} } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await addPost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(500);
      expect(mRes.send).toHaveBeenCalledWith({
        error: 'Failed to save. Please try again later.',
        from: 'posts-api',
        timestamp: expect.anything(),
      });
    });

    it('should return 201 whem post is saved', async () => {
      const mReq = { body: postPayload } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await addPost(mReq, mRes, mNext);

      expect(mRes.status).toHaveBeenCalledWith(201);
    });

    it('should call next whem body is missing a required field', async () => {
      const mReq = { body: missingTitlePayload } as any;
      const mRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
      const mNext = jest.fn();
      await addPost(mReq, mRes, mNext);

      expect(mNext).toHaveBeenCalled();
    });
  });
});
