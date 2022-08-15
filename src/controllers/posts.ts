import { NextFunction, Request, Response } from "express"
import { IPost } from "../dtos/post"
import Posts from "../models/posts"
import logger from "../helpers/logger"
import { IError } from "../dtos/error"
import { Document, Types } from "mongoose"

const postBuilder: (document: (Document<unknown, any, IPost> & IPost & {
    _id: Types.ObjectId;
  })) => IPost = (document) => {
    const post: IPost = {
      id: document._id.toString(),
      title: document.title,
      body: document.body,
      tags: document.tags
    }

  return post
}

export const addPost = async (req: Request, res: Response, next: NextFunction) => {

  const post = new Posts(req.body)
  const document = await post.save().catch(next)

  if (!document) {
    logger.error("Failed to save.", { method: req.method, statusCode: 500 })
    const errorOutput: IError = {
      error: "Failed to save. Please try again later.",
      from: "posts-api",
      timestamp: Date.now()
    }
    res.status(500).send(errorOutput)
    return
  }

  res.status(201).send(postBuilder(document))
}

export const getPostsById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  
  const document = await Posts.findById(id).catch(next)

  if (!document) {
    logger.error("Not Found", { method: req.method, statusCode: 404 })
    const errorOutput: IError = {
      error: "Not Found",
      from: "posts-api",
      timestamp: Date.now()
    }
    res.status(404).send(errorOutput)
    return
  }

  res.status(200).send(postBuilder(document))
}

export const listPosts = async (req: Request, res: Response, _: NextFunction) => {

  const index: number = parseInt(req.query.index as string);
  const size: number =  parseInt(req.query.size as string);

  const documents: Array<IPost> = await Posts.find().skip(index * size).limit(size)

  const output: IPost[] = documents.map(postBuilder);
  res.status(200).send(output)

}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const post  = req.body

  const document = await Posts.findOneAndUpdate({ _id: id}, post, { returnOriginal: false }).catch(next)

  if (!document) {
    logger.error("Not Found", {method: req.method, statusCode: 404})
    const notFound: IError = {
      error: "Not Found",
      from: "posts-api",
      timestamp: Date.now()
    }
    res.status(404).send(notFound)
    return
  }

  res.status(200).send(postBuilder(document))
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const deleteResult = await Posts.deleteOne({ _id: id }).catch(next)
  
  if (deleteResult && deleteResult.deletedCount === 0) {
    logger.error("Not Found", {method: req.method, statusCode: 404})
    const notFound: IError = {
      error: "Not Found",
      from: "posts-api",
      timestamp: Date.now()
    }
    res.status(404).send(notFound)
    return
  }

  res.status(204).send()
}
