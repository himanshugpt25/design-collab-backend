import { Schema, model, Document, Types } from 'mongoose';

export interface CommentMention {
  userId?: string;
  username: string;
}

export interface CommentDocument extends Document {
  designId: Types.ObjectId;
  authorName: string;
  text: string;
  mentions: CommentMention[];
  createdAt: Date;
  updatedAt: Date;
}

const mentionSchema = new Schema<CommentMention>(
  {
    userId: { type: String },
    username: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema<CommentDocument>(
  {
    designId: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true },
    mentions: { type: [mentionSchema], default: [] },
  },
  { timestamps: true }
);

commentSchema.index({ designId: 1, createdAt: 1 });

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
