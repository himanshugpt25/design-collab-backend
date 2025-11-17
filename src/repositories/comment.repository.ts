import { Model } from 'mongoose';
import { CommentModel, CommentDocument } from '../models/Comment';
import { CommentCreateInput } from '../schemas/comment.schema';
import { CommentMention } from '../types/comment';

export const createCommentRepository = (model: Model<CommentDocument> = CommentModel) => ({
  findByDesignId: (designId: string) => model.find({ designId }).sort({ createdAt: 1 }).exec(),
  create: (designId: string, payload: CommentCreateInput & { mentions: CommentMention[] }) =>
    model.create({ designId, ...payload }),
});
