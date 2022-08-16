import { NextFunction, Request, Response } from 'express';
import Posts from '../../models/posts';
import logger from '../../helpers/logger';
import { IError } from '../../dtos/error';
import { postBuilder } from '../../helpers/factory';

export const addPost: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const post = new Posts(req.body);
  const document = await post.save().catch(next);

  if (!document) {
    logger.error('Failed to save.', { method: req.method, statusCode: 500 });
    const errorOutput: IError = {
      error: 'Failed to save. Please try again later.',
      from: 'posts-api',
      timestamp: Date.now(),
    };
    res.status(500).send(errorOutput);
    return;
  }

  res.status(201).send(postBuilder(document));
};
