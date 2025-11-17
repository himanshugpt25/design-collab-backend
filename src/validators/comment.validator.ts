import { validateRequest } from '../middleware/validateRequest';
import { commentCreateSchema, commentDesignParamSchema } from '../schemas/comment.schema';

export const validateCommentParams = validateRequest({ params: commentDesignParamSchema });

export const validateCommentCreate = validateRequest({
  params: commentDesignParamSchema,
  body: commentCreateSchema,
});
