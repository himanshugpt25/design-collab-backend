import { CommentDocument } from '../models/Comment';
import { Comment } from '../types/comment';
import { CommentCreateInput } from '../schemas/comment.schema';
import { CommentMention } from '../types/comment';
import { createCommentRepository } from '../repositories/comment.repository';

const mentionRegex = /@([A-Za-z0-9_]+)/g;

const extractMentions = (text: string): CommentMention[] => {
  const mentions: CommentMention[] = [];
  let match: RegExpExecArray | null;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({ username: match[1] });
  }
  return mentions;
};

const mapCommentDocument = (doc: CommentDocument): Comment => ({
  _id: doc.id,
  designId: doc.designId.toString(),
  authorName: doc.authorName,
  text: doc.text,
  mentions: doc.mentions,
  createdAt: doc.createdAt.toISOString(),
});

const commentRepository = createCommentRepository();

export const listCommentsByDesign = async (designId: string): Promise<Comment[]> => {
  const comments = await commentRepository.findByDesignId(designId);
  return comments.map(mapCommentDocument);
};

export const createCommentForDesign = async (
  designId: string,
  payload: CommentCreateInput
): Promise<Comment> => {
  const mentions = extractMentions(payload.text);

  const commentDoc = await commentRepository.create(designId, {
    ...payload,
    mentions,
  });

  return mapCommentDocument(commentDoc);
};
