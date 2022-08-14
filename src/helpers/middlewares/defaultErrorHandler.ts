import logger from "../logger";
import { Request, Response, NextFunction } from "express";
import { IError } from "../../dtos/error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, {method: req.method, statusCode: 500})
  const errorOutput: IError = {
    error: err.message,
    from: "furza-posts-api",
    timestamp: Date.now()
  }
  res.status(500).send(errorOutput)
}