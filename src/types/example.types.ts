import { z } from 'zod';

// Zod schemas for validation
export const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  isActive: z.boolean().optional().default(true),
});

// TypeScript types inferred from Zod schemas
export type CreateExampleInput = z.infer<typeof createExampleSchema>;

