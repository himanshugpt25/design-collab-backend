import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { register, login, refresh } from '../controllers/auth.controller';
import { validateLogin, validateRefresh, validateRegister } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRegister, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.post('/refresh', validateRefresh, asyncHandler(refresh));

export default router;
