import { Schema, model, Document } from 'mongoose';
import { DesignElement } from '../types/design';

export interface DesignDocument extends Document {
  name: string;
  width: number;
  height: number;
  elements: DesignElement[];
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const elementSchema = new Schema<DesignElement>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'rect', 'circle'], required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    rotation: { type: Number, required: true },
    zIndex: { type: Number, required: true },
    opacity: { type: Number, required: true, min: 0, max: 1 },
    locked: { type: Boolean },
    text: String,
    fontFamily: String,
    fontSize: Number,
    fontWeight: { type: String, enum: ['normal', 'bold'] },
    fill: String,
    align: { type: String, enum: ['left', 'center', 'right'] },
    src: String,
    fit: { type: String, enum: ['contain', 'cover'] },
    stroke: String,
    strokeWidth: Number,
    radius: Number,
  },
  { _id: false }
);

const designSchema = new Schema<DesignDocument>(
  {
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    elements: { type: [elementSchema], default: [] },
    thumbnailUrl: { type: String },
  },
  { timestamps: true }
);

designSchema.index({ updatedAt: -1 });
designSchema.index({ name: 1 });

export const DesignModel = model<DesignDocument>('Design', designSchema);
