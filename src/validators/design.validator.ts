import { validateRequest } from '../middleware/validateRequest';
import { designCreateSchema, designListQuerySchema, designSchema } from '../schemas/design.schema';

export const validateDesignCreate = validateRequest({ body: designCreateSchema });
export const validateDesignListQuery = validateRequest({ query: designListQuerySchema });
export const validateDesignUpdate = validateRequest({ body: designSchema });
