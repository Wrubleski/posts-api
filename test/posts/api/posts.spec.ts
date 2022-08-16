import request from 'supertest';
import app from '../../../src/app';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import Posts from '../../../src/models/posts';
import { populate } from '../../../src/infrastructure/populateDatabase';
import { missingTitlePayload, postPayload } from '../utils/mocks';

const expectedPost: jest.Expect = expect.objectContaining({
  id: expect.any(String),
  title: expect.any(String),
  body: expect.any(String),
  tags: expect.any(Array<string>),
});

describe('Post API Integration Tests', () => {
  const endpoint = '/api/posts/';
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

  it('should have a mocked app', async () => {
    expect(app).toBeDefined();
  });

  it('should return 404 whem trying to hit a non-existent resource', async () => {
    return request(app)
      .get('/qwerty')
      .then((res) => {
        expect(res.statusCode).toBe(404);
      });
  });

  describe('addPost Tests', () => {
    it('should return 201 whem creating a post', async () => {
      return request(app)
        .post(endpoint)
        .send(postPayload)
        .then((res) => {
          id = res.body.id;
          expect(res.statusCode).toBe(201);
        });
    });

    test('Response body should have the expected fields', async () => {
      return request(app)
        .post(endpoint)
        .send(postPayload)
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(expectedPost);
        });
    });

    it('should return 400 whem trying to save a post with invalid schema: {title: boolean}', async () => {
      return request(app)
        .post(endpoint)
        .send({ ...postPayload, title: false })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error.title[0]).toBe(
            'Expected string, received boolean',
          );
        });
    });

    it('should inform what field is missing whem requesting with a missing field', async () => {
      return request(app)
        .post(endpoint)
        .send(missingTitlePayload)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toHaveProperty('title');
        });
    });
  });

  describe('getPostsById Tests', () => {
    it('should return the post by id', async () => {
      return request(app)
        .get(endpoint + id)
        .then((res) => {
          expect(res.statusCode).toBe(200);
        });
    });

    it('should return 404 whem the post searched does not exist', async () => {
      return request(app)
        .get(endpoint + 'abcdef123456abcdef123456')
        .then((res) => {
          expect(res.statusCode).toBe(404);
        });
    });

    it('should return 400 whem the post searched does not follow the path param format', async () => {
      return request(app)
        .get(endpoint + 'abcdef123456abcdef123456xx')
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain('twenty four hex characters');
        });
    });
  });

  describe('updatePost Tests', () => {
    it('should update the post title', async () => {
      return request(app)
        .put(endpoint + id)
        .send({ ...postPayload, title: 'foo' })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.title).toBe('foo');
        });
    });
    it('should return 400 whem the post searched does not follow the query param format', async () => {
      return request(app)
        .put(endpoint + 'abcdef123456abcdef123456xx')
        .send({ ...postPayload, title: 'foo' })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain('twenty four hex characters');
        });
    });

    it('should inform what field is missing whem requesting with a missing field', async () => {
      return request(app)
        .put(endpoint + id)
        .send(missingTitlePayload)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toHaveProperty('title');
        });
    });
  });

  describe('deletePost Tests', () => {
    it('should return 204 whem deleting a post', async () => {
      return request(app)
        .del(endpoint + id)
        .then((res) => {
          expect(res.statusCode).toBe(204);
        });
    });

    it('should return 400 whem the post searched does not follow the path param format', async () => {
      return request(app)
        .del(endpoint + 'abcdef123456abcdef123456xx')
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain('twenty four hex characters');
        });
    });
  });

  describe('listPosts Tests', () => {
    it('should return the requested number of posts', async () => {
      return request(app)
        .get(endpoint)
        .query({ size: 5, index: 0 })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveLength(5);
        });
    });

    it('should return 400 whem size query parameter is missing', async () => {
      return request(app)
        .get(endpoint)
        .query({ index: 1 })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain('Missing query parameter [size].');
        });
    });

    it('should return 400 whem index query parameter is missing', async () => {
      return request(app)
        .get(endpoint)
        .query({ size: 2 })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain('Missing query parameter [index].');
        });
    });

    it('should return 400 whem both index and size query parameter are missing', async () => {
      return request(app)
        .get(endpoint)
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain(
            'Missing query parameter [size,index].',
          );
        });
    });

    it("should return empty array whem there's no posts", async () => {
      return request(app)
        .get(endpoint)
        .query({ size: 100, index: 3 })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveLength(0);
        });
    });

    it('should return a validation error whem size or index are not integer', async () => {
      return request(app)
        .get(endpoint)
        .query({ size: 'foo', index: 'bar' })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toContain(
            'Validation error. Size and index must be integer.',
          );
        });
    });

    it('should return a validation error whem size or index not positive integers', async () => {
      return request(app)
        .get(endpoint)
        .query({ size: -1, index: -5 })
        .then((res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error.size).toContain('size must be positive');
          expect(res.body.error.index).toContain('index must be positive');
        });
    });
  });
});
