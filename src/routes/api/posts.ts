import express, { NextFunction, Request, Response, Router } from 'express';
import {
  postBodyValidator,
  paginationQueryValidator,
  postPathParamValidator,
} from '../../helpers/middlewares/validator';
import * as controller from '../../controllers/posts';
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
  .get('/posts', paginationQueryValidator, caller(controller.listPosts))
  .post('/posts', postBodyValidator, caller(controller.addPost))
  .get('/posts/:id', postPathParamValidator, caller(controller.getPostsById))
  .put(
    '/posts/:id',
    postBodyValidator,
    postPathParamValidator,
    caller(controller.updatePost),
  )
  .delete('/posts/:id', postPathParamValidator, caller(controller.deletePost));

export default router;
