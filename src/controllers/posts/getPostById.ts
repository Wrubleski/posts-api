import { NextFunction, Request, Response } from 'express';
import Posts from '../../models/posts';
import logger from '../../helpers/logger';
import { IError } from '../../dtos/error';
import { postBuilder } from '../../helpers/factory';

export const getPostById: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  const document = await Posts.findById(id).catch(next);

  if (!document) {
    logger.error('Not Found', { method: req.method, statusCode: 404 });
    const errorOutput: IError = {
      error: 'Not Found',
      from: 'posts-api',
      timestamp: Date.now(),
    };
    res.status(404).send(errorOutput);
    return;
  }

  res.status(200).send(postBuilder(document));
};
