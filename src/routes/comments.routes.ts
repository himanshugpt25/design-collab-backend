import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router({ mergeParams: true });

// GET /api/designs/:designId/comments
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { designId } = req.params;

    // TODO: Replace with database query filtered by designId.
    const comments: unknown[] = [];
    res.status(200).json({ data: comments, error: null, meta: { designId } });
  })
);

// POST /api/designs/:designId/comments
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { designId } = req.params;

    // TODO: Validate payload with Zod, parse mentions, persist comment.
    const createdComment: unknown = null;
    res.status(201).json({ data: createdComment, error: null, meta: { designId } });
  })
);

export default router;
