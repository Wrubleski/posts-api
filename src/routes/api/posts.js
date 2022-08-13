import express from "express";
import * as controller from "../../controllers/posts.js";

const router = express.Router();

router
  .get("/posts", controller.getPaginatedPosts)
  .post("/posts", controller.addPost)
  .get("/posts/:id", controller.getPostsById)
  .put("/posts/:id", controller.updatePost)
  .delete("/posts/:id", controller.deletePost)

export default router;
