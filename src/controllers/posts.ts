import { Request, Response } from "express"

export const getPaginatedPosts = (req: Request, res: Response) => {
  res.status(200).send("getPaginatedPosts")
}

export const addPost = (req: Request, res: Response) => {
  res.status(200).send("addPost")
}

export const getPostsById = (req: Request, res: Response) => {
  res.status(200).send("getPostsById: " + req.params.id)
}

export const updatePost = (req: Request, res: Response) => {
  res.status(200).send("updatePost: " + req.params.id)
}

export const deletePost = (req: Request, res: Response) => {
  res.status(200).send("deletePost: " + + req.params.id)
}