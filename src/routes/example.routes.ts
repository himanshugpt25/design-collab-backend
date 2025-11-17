import { Router } from 'express';
import {
  createExample,
  getAllExamples,
  getExampleById,
} from '../controllers/example.controller';

const router = Router();

router.post('/', createExample);
router.get('/', getAllExamples);
router.get('/:id', getExampleById);

export default router;

