import { validateRequest } from '../middleware/validateRequest';
import { designCreateSchema } from '../schemas/design.schema';

export const validateDesignCreate = validateRequest({ body: designCreateSchema });
