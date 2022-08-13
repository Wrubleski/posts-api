import { Request, Response, NextFunction } from "express";
import { z, ZodError, typeToFlattenedError } from "zod"
import logger from "../logger";

const Post = z.object({
  title: z.string({
    required_error: "title is required",
  }),
  body: z.string({
    required_error: "body is required",
  }),
  tags: z.array(z.string())
})

const postValidator = (req: Request, res: Response, next: NextFunction) => {
    try {
    Post.parse(req.body)
  } catch (err) {
    if (err instanceof ZodError) {
      const errors: typeToFlattenedError<any, string> = err.flatten()
      logger.error("Input validation error", {method: req.method, statusCode: 400})
      res.status(400).json({ error: errors.fieldErrors, from: "fuerza-posts-api", timestamp: Date.now() })
      return;
    }
  }
  next()
}

export default postValidator