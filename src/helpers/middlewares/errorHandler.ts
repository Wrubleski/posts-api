import logger from '../logger';
import { Request, Response } from 'express';
import { IError } from '../../dtos/error';

export const errorHandler: (err: Error, req: Request, res: Response) => void = (
  err: Error,
  req: Request,
  res: Response,
) => {
  logger.error(err.message, { method: req.method, statusCode: 500 });
  const errorOutput: IError = {
    error: err.message,
    from: 'posts-api',
    timestamp: Date.now(),
  };
  res.status(500).send(errorOutput);
};
