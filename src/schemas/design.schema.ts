import { z } from 'zod';

export const baseElementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'rect', 'circle']),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  zIndex: z.number(),
  opacity: z.number().min(0).max(1),
  locked: z.boolean().optional(),
});

const textElementSchema = baseElementSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  fontFamily: z.string(),
  fontSize: z.number(),
  fontWeight: z.enum(['normal', 'bold']),
  fill: z.string(),
  align: z.enum(['left', 'center', 'right']),
});

const imageElementSchema = baseElementSchema.extend({
  type: z.literal('image'),
  src: z.string().url(),
  fit: z.enum(['contain', 'cover']),
});

const rectElementSchema = baseElementSchema.extend({
  type: z.literal('rect'),
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number(),
  radius: z.number(),
});

const circleElementSchema = baseElementSchema.extend({
  type: z.literal('circle'),
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number(),
  radius: z.number(),
});

export const designElementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  imageElementSchema,
  rectElementSchema,
  circleElementSchema,
]);

export const designSchema = z.object({
  name: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  elements: z.array(designElementSchema),
  thumbnailUrl: z.string().url().optional(),
});

export const designCreateSchema = designSchema
  .pick({
    name: true,
    width: true,
    height: true,
  })
  .strict();

export type DesignElementInput = z.infer<typeof designElementSchema>;
export type DesignInput = z.infer<typeof designSchema>;
export type DesignCreateInput = z.infer<typeof designCreateSchema>;
