import { z } from 'zod';

export const commentCreateSchema = z.object({
  authorName: z.string().min(1).optional(),
  text: z.string().min(1),
});

export const commentDesignParamSchema = z.object({
  designId: z.string().min(1),
});

export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type CommentDesignParamInput = z.infer<typeof commentDesignParamSchema>;
