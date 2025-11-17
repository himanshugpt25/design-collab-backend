import { Router } from 'express';
import exampleRoutes from './example.routes';

const router = Router();

// Mount route modules
router.use('/examples', exampleRoutes);

// Add more routes here as needed
// router.use('/users', userRoutes);
// router.use('/projects', projectRoutes);

export default router;
