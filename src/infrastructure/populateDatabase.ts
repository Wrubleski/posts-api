import { Model } from "mongoose";
import { IPost } from "../dtos/post";
import logger from "../helpers/logger";
import mockData from "./mock.json"


export const populate = async (postModel: Model<IPost>) => {
  const data: IPost[] = mockData as IPost[];
  await postModel.insertMany(data)
  logger.info("Database populated with mock data", { action: "Database populated" })
}