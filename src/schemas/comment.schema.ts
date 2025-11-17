import { z } from 'zod';

export const commentCreateSchema = z.object({
  authorName: z.string().min(1),
  text: z.string().min(1),
});

export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
