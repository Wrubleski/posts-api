import { NextFunction, Request, Response } from 'express';
import Posts from '../../models/posts';
import logger from '../../helpers/logger';
import { IError } from '../../dtos/error';

export const deletePost: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const deleteResult = await Posts.deleteOne({ _id: id }).catch(next);

  if (deleteResult && deleteResult.deletedCount === 0) {
    logger.warn('Not Found', { method: req.method, statusCode: 404 });
    const notFound: IError = {
      error: 'Not Found',
      from: 'posts-api',
      timestamp: Date.now(),
    };
    res.status(404).send(notFound);
    return;
  }

  res.status(204).send();
};
