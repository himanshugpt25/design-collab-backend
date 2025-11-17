import { Response } from 'express';
import { listCommentsByDesign, createCommentForDesign } from '../services/comment.service';
import { CommentCreateInput } from '../schemas/comment.schema';
import { AuthenticatedRequest } from '../middleware/authenticate';

export const getCommentsForDesign = async (req: AuthenticatedRequest, res: Response) => {
  const { designId } = req.params;
  const comments = await listCommentsByDesign(designId);
  res.status(200).json({ data: comments, error: null });
};

export const createCommentForDesignController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { designId } = req.params;
  const payload = req.body as CommentCreateInput;
  if (!req.user?.id) {
    return res.status(401).json({ data: null, error: { message: 'Unauthorized' } });
  }
  const authorName = req.user.name || req.user.email || payload.authorName || 'Anonymous';
  const authorId = req.user.id;
  const comment = await createCommentForDesign(designId, {
    ...payload,
    authorId,
    authorName,
  });
  return res.status(201).json({ data: comment, error: null });
};
