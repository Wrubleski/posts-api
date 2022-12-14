import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z, ZodError, typeToFlattenedError } from 'zod';
import { IError } from '../../dtos/error';
import logger from '../logger';

const Post = z.object({
  title: z.string({
    required_error: 'title is required',
  }),
  body: z.string({
    required_error: 'body is required',
  }),
  tags: z.array(z.string(), { required_error: 'at least one tag is required' }),
});

const PostPaginationQuery = z.object({
  size: z
    .number({
      required_error: 'size is required',
    })
    .int({
      message: 'size must be an integer',
    })
    .nonnegative({ message: 'size must be positive' })
    .min(1, { message: 'size must be > 0' }),
  index: z
    .number({
      required_error: 'index is required',
    })
    .int({
      message: 'index must be an integer',
    })
    .nonnegative({ message: 'index must be positive' }),
});

const validationErrorHandler: (
  req: Request,
  res: Response,
  errorMessage: string | Record<string, unknown>,
) => void = (
  req: Request,
  res: Response,
  errorMessage: string | Record<string, unknown>,
) => {
  logger.warn('Input validation error', {
    method: req.method,
    statusCode: 400,
  });
  const errorOutput: IError = {
    error: errorMessage,
    from: 'posts-api',
    timestamp: Date.now(),
  };
  res.status(400).json(errorOutput);
};

export const paginationQueryValidator: (
  req: Request,
  res: Response,
  next: NextFunction,
) => void = (req: Request, res: Response, next: NextFunction) => {
  const query = {
    size: Number(req.query.size),
    index: Number(req.query.index),
  };

  const missingParamenter: string[] = [];

  if (!req.query.size) missingParamenter.push('size');
  if (!req.query.index) missingParamenter.push('index');

  if (missingParamenter.length > 0) {
    validationErrorHandler(
      req,
      res,
      `Validation error. Missing query parameter [${missingParamenter}].`,
    );
    return;
  }

  if (isNaN(query.size) || isNaN(query.index)) {
    validationErrorHandler(
      req,
      res,
      'Validation error. Size and index must be integer.',
    );
    return;
  }

  try {
    PostPaginationQuery.parse(query);
  } catch (err) {
    if (err instanceof ZodError) {
      const errors: typeToFlattenedError<any, string> = err.flatten();
      validationErrorHandler(req, res, errors.fieldErrors);
      return;
    }
  }
  next();
};

export const postBodyValidator: (
  req: Request,
  res: Response,
  next: NextFunction,
) => void = (req: Request, res: Response, next: NextFunction) => {
  try {
    Post.parse(req.body);
  } catch (err) {
    if (err instanceof ZodError) {
      const errors: typeToFlattenedError<any, string> = err.flatten();
      validationErrorHandler(req, res, errors.fieldErrors);
      return;
    }
  }
  next();
};

export const postPathParamValidator: (
  req: Request,
  res: Response,
  next: NextFunction,
) => void = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    validationErrorHandler(req, res, 'Id must have twenty four hex characters');
    return;
  }
  next();
};
