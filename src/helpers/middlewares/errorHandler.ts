import logger from '../logger';
import { Request, Response } from 'express';
import { IError } from '../../dtos/error';
import { NextFunction } from 'connect';

export const errorHandler: (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.warn(err.message, { method: req.method, statusCode: 500 });
  const errorOutput: IError = {
    error: err.message,
    from: 'posts-api',
    timestamp: Date.now(),
  };
  res.status(500).send(errorOutput);
};
