import { Router } from 'express';
import exampleRoutes from './example.routes';
import designsRoutes from './designs.routes';
import commentsRoutes from './comments.routes';

const router = Router();

// Mount route modules
router.use('/examples', exampleRoutes);
router.use('/designs', designsRoutes);
router.use('/designs/:designId/comments', commentsRoutes);

// Add more routes here as needed
// router.use('/users', userRoutes);
// router.use('/projects', projectRoutes);

export default router;
