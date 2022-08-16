import logger from '../../../src/helpers/logger';
import { connect, stop } from '../../../src/infrastructure/dbConfig';
import { populate } from '../../../src/infrastructure/populateDatabase';
import Posts from '../../../src/models/posts';

global.beforeAll(async () => {
  logger.transports.forEach((t) => (t.silent = true));
  // Setup a database before running tests. Using in-memory mongodb server.
  await connect();
  await populate(Posts);
});

global.afterAll(async () => {
  await stop();
});
