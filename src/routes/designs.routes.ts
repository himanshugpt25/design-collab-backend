import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  listDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/design.controller';
import { validateDesignCreate, validateDesignListQuery } from '../validators/design.validator';

const router = Router();

// GET /api/designs
router.get('/', validateDesignListQuery, asyncHandler(listDesigns));

// GET /api/designs/:id
router.get('/:id', asyncHandler(getDesignById));

// POST /api/designs
router.post('/', validateDesignCreate, asyncHandler(createDesign));

// PUT /api/designs/:id
router.put('/:id', asyncHandler(updateDesign));

// DELETE /api/designs/:id
router.delete('/:id', asyncHandler(deleteDesign));

export default router;
