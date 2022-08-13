import express, { Router } from "express";
import postValidator from "../../helpers/middlewares/postValidator";
import * as controller from "../../controllers/posts";

const router: Router = express.Router();


router
  .get("/posts", controller.getPaginatedPosts)
  .post("/posts", postValidator, controller.addPost)
  .get("/posts/:id", controller.getPostsById)
  .put("/posts/:id", postValidator, controller.updatePost)
  .delete("/posts/:id", controller.deletePost)

export default router;
