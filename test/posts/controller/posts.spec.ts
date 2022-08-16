import { populate } from '../../../src/infrastructure/populateDatabase';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { missingTitlePayload, postPayload } from '../utils/mocks';
import { addPost } from '../../../src/controllers/posts/addPost';
import { listPosts } from '../../../src/controllers/posts/listPosts';
import { getPostById } from '../../../src/controllers/posts/getPostById';
import { updatePost } from '../../../src/controllers/posts/updatePost';
import { deletePost } from '../../../src/controllers/posts/deletePost';

describe('Post Controller unit tests', () => {
  let id: string;
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
      // setup for delete and getPostById test
      id = mRes.send.mock.lastCall[0][0].id;
    });
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
