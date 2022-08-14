import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"
import logger from "../helpers/logger";

export const connect = async () => {
  const mongoServer: MongoMemoryServer = await MongoMemoryServer.create();
  logger.info("Database is up and running", {action: "mongodb memory server created"})
  const uri: string = mongoServer.getUri();
  await mongoose.connect(uri);
  logger.info("Successfully connected to database", {action: "mongoose successfully connected to the mongodb in memory server"})
};

