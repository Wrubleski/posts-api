import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from '../helpers/logger';

let mongoServer: MongoMemoryServer;

export const connect: () => Promise<void> = async () => {
  mongoServer = await MongoMemoryServer.create();
  logger.info('Database is up and running', {
    action: 'mongodb memory server created',
  });
  const uri: string = mongoServer.getUri();
  await mongoose.connect(uri);
  logger.info('Successfully connected to database', {
    action: 'mongoose successfully connected to mongodb in memory server',
  });
};

export const stop: () => Promise<void> = async () => {
  mongoose.disconnect();
  await mongoServer.stop();
  logger.info('Successfully terminated database', {
    action: 'mongodb memory server stoped',
  });
};
