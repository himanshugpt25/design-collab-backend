import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import {
  listDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/design.controller';
import {
  validateDesignCreate,
  validateDesignListQuery,
  validateDesignUpdate,
} from '../validators/design.validator';

const router = Router();

router.use(authenticate);

// GET /api/designs
router.get('/', validateDesignListQuery, asyncHandler(listDesigns));

// GET /api/designs/:id
router.get('/:id', asyncHandler(getDesignById));

// POST /api/designs
router.post('/', validateDesignCreate, asyncHandler(createDesign));

// PUT /api/designs/:id
router.put('/:id', validateDesignUpdate, asyncHandler(updateDesign));

// DELETE /api/designs/:id
router.delete('/:id', asyncHandler(deleteDesign));

export default router;
