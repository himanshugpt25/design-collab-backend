import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import {
  AppError,
  BadRequestError,
  ConflictError,
  ValidationError as DomainValidationError,
} from '../utils/errors';

type MongoServerErrorLike = {
  code?: number;
  keyValue?: Record<string, unknown>;
};

const isDuplicateKeyError = (error: MongoServerErrorLike): boolean => error.code === 11000;

const buildZodValidationError = (error: ZodError): DomainValidationError => {
  const issues = error.errors.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

  return new DomainValidationError(issues);
};

const buildMongooseValidationError = (
  error: mongoose.Error.ValidationError
): DomainValidationError => {
  const issues = Object.values(error.errors).map((validationError) => ({
    path: validationError.path,
    message: validationError.message,
  }));

  return new DomainValidationError(issues);
};

const buildMongooseCastError = (error: mongoose.Error.CastError): BadRequestError => {
  const message = `Invalid value '${error.value}' provided for '${error.path}'.`;
  return new BadRequestError(message, { path: error.path, value: error.value });
};

const buildDuplicateKeyError = (error: MongoServerErrorLike): ConflictError => {
  return new ConflictError('Duplicate field value detected', { fields: error.keyValue });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    console.error('Error:', err);
  }

  let appError: AppError | null = null;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof ZodError) {
    appError = buildZodValidationError(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    appError = buildMongooseValidationError(err);
  } else if (err instanceof mongoose.Error.CastError) {
    appError = buildMongooseCastError(err);
  } else if (isDuplicateKeyError(err as MongoServerErrorLike)) {
    appError = buildDuplicateKeyError(err as MongoServerErrorLike);
  }

  if (!appError) {
    appError = new AppError(500, 'Internal Server Error', {
      isOperational: false,
    });
  }

  res.status(appError.statusCode).json(appError.toJSON(isDevelopment));
};
