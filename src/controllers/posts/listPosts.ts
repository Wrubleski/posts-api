import { NextFunction, Request, Response } from 'express';
import { IPost } from '../../dtos/post';
import Posts from '../../models/posts';
import { postBuilder } from '../../helpers/factory';

export const listPosts: (
  req: Request,
  res: Response,
  _: NextFunction,
) => Promise<void> = async (req: Request, res: Response, _: NextFunction) => {
  const index: number = parseInt(req.query.index as string);
  const size: number = parseInt(req.query.size as string);

  const documents: Array<IPost> = await Posts.find()
    .skip(index * size)
    .limit(size);

  const output: IPost[] = documents.map(postBuilder);
  res.status(200).send(output);
};
