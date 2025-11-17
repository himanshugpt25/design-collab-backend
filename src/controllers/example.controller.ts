import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ExampleModel } from '../models/example.model';
import { createExampleSchema, CreateExampleInput } from '../types/example.types';
import { NotFoundError } from '../utils/errors';

/**
 * @route   POST /api/examples
 * @desc    Create a new example
 * @access  Public
 */
export const createExample = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body with Zod
  const validatedData: CreateExampleInput = createExampleSchema.parse(req.body);

  // Create example in database
  const example = await ExampleModel.create(validatedData);

  res.status(201).json({
    success: true,
    data: example,
  });
});

/**
 * @route   GET /api/examples
 * @desc    Get all examples
 * @access  Public
 */
export const getAllExamples = asyncHandler(async (_req: Request, res: Response) => {
  const examples = await ExampleModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: examples.length,
    data: examples,
  });
});

/**
 * @route   GET /api/examples/:id
 * @desc    Get a single example by ID
 * @access  Public
 */
export const getExampleById = asyncHandler(async (req: Request, res: Response) => {
  const example = await ExampleModel.findById(req.params.id);

  if (!example) {
    throw new NotFoundError('Example', { id: req.params.id });
  }

  res.status(200).json({
    success: true,
    data: example,
  });
});

