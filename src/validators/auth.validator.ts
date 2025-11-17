import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schema';

export const validateRegister = validateRequest({ body: registerSchema });
export const validateLogin = validateRequest({ body: loginSchema });
export const validateRefresh = validateRequest({ body: refreshSchema });
