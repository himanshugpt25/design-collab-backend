import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Design } from '../types/design';

const router = Router();

// GET /api/designs
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const designs: Design[] = [];

    // TODO: Replace with database query once models are available.
    res.status(200).json({ data: designs, error: null });
  })
);

// GET /api/designs/:id
router.get(
  '/:id',
  asyncHandler(async (_req, res) => {
    // TODO: Fetch a single design by id from database.
    res.status(200).json({ data: null, error: null });
  })
);

// POST /api/designs
router.post(
  '/',
  asyncHandler(async (_req, res) => {
    // TODO: Validate payload with Zod and create a design.
    const createdDesign: Design | null = null;
    res.status(201).json({ data: createdDesign, error: null });
  })
);

// PUT /api/designs/:id
router.put(
  '/:id',
  asyncHandler(async (_req, res) => {
    // TODO: Validate payload, update the design, and return it.
    const updatedDesign: Design | null = null;
    res.status(200).json({ data: updatedDesign, error: null });
  })
);

// DELETE /api/designs/:id
router.delete(
  '/:id',
  asyncHandler(async (_req, res) => {
    // TODO: Delete the design and return confirmation metadata.
    res.status(200).json({ data: { deleted: true }, error: null });
  })
);

export default router;
