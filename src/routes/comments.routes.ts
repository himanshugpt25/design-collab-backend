import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  getCommentsForDesign,
  createCommentForDesignController,
} from '../controllers/comment.controller';
import { validateCommentParams, validateCommentCreate } from '../validators/comment.validator';

const router = Router({ mergeParams: true });

// GET /api/designs/:designId/comments
router.get('/', validateCommentParams, asyncHandler(getCommentsForDesign));

// POST /api/designs/:designId/comments
router.post('/', validateCommentCreate, asyncHandler(createCommentForDesignController));

export default router;
