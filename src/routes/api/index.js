import express from "express";
import posts from "./posts.js"

const routes = (app) => {
  app.use(
    "/api",
    express.json(),
    posts
  )
}

export default routes