import { NextFunction, Request, Response } from 'express';
import Posts from '../../models/posts';
import logger from '../../helpers/logger';
import { IError } from '../../dtos/error';
import { postBuilder } from '../../helpers/factory';

export const updatePost: (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const post = req.body;

  const document = await Posts.findOneAndUpdate({ _id: id }, post, {
    returnOriginal: false,
  }).catch(next);

  if (!document) {
    logger.warn('Not Found', { method: req.method, statusCode: 404 });
    const notFound: IError = {
      error: 'Not Found',
      from: 'posts-api',
      timestamp: Date.now(),
    };
    res.status(404).send(notFound);
    return;
  }

  res.status(200).send(postBuilder(document));
};
