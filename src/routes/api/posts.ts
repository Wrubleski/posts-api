import express, { NextFunction, Request, Response, Router } from 'express';
import { addPost } from '../../controllers/posts/addPost';
import { deletePost } from '../../controllers/posts/deletePost';
import { getPostById } from '../../controllers/posts/getPostById';
import { listPosts } from '../../controllers/posts/listPosts';
import { updatePost } from '../../controllers/posts/updatePost';
import {
  postBodyValidator,
  paginationQueryValidator,
  postPathParamValidator,
} from '../../helpers/middlewares/validator';

const router: Router = express.Router();

/**
 * Using a higher order function as a caller to globally handle errors
 */
const caller: (
  fn: any,
) => (req: Request, res: Response, next: NextFunction) => Promise<any> =
  (fn) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router
  .get('/posts', paginationQueryValidator, caller(listPosts))
  .post('/posts', postBodyValidator, caller(addPost))
  .get('/posts/:id', postPathParamValidator, caller(getPostById))
  .put(
    '/posts/:id',
    postBodyValidator,
    postPathParamValidator,
    caller(updatePost),
  )
  .delete('/posts/:id', postPathParamValidator, caller(deletePost));

export default router;
