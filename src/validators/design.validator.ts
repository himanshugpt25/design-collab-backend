import { validateRequest } from '../middleware/validateRequest';
import { designCreateSchema, designListQuerySchema } from '../schemas/design.schema';

export const validateDesignCreate = validateRequest({ body: designCreateSchema });
export const validateDesignListQuery = validateRequest({ query: designListQuerySchema });
