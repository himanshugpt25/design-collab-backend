import { Request, Response } from 'express';
import {
  listCommentsByDesign,
  createCommentForDesign,
} from '../services/comment.service';
import { CommentCreateInput } from '../schemas/comment.schema';

export const getCommentsForDesign = async (req: Request, res: Response) => {
  const { designId } = req.params;
  const comments = await listCommentsByDesign(designId);
  res.status(200).json({ data: comments, error: null });
};

export const createCommentForDesignController = async (req: Request, res: Response) => {
  const { designId } = req.params;
  const payload = req.body as CommentCreateInput;
  const comment = await createCommentForDesign(designId, payload);
  res.status(201).json({ data: comment, error: null });
};
