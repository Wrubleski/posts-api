import express, { NextFunction, Request, Response, Router } from "express";
import { postValidator, paginationQueryValidator, postPathParamValidator } from "../../helpers/middlewares/validator";
import * as controller from "../../controllers/posts";
const router: Router = express.Router();

/**
 * Using a higher order function as a caller to globally handle errors
 */
const caller = fn => (req: Request, res: Response, next: NextFunction) => 
  Promise.resolve(fn(req, res, next)).catch(next)

router
  .get("/posts", paginationQueryValidator, caller(controller.getPaginatedPosts))
  .post("/posts", postValidator, caller(controller.addPost))
  .get("/posts/:id", postPathParamValidator, caller(controller.getPostsById))
  .put("/posts/:id", postValidator, postPathParamValidator, caller(controller.updatePost))
  .delete("/posts/:id", postPathParamValidator, caller(controller.deletePost))

export default router;
