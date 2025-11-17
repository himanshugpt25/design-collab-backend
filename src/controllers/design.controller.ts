import { Request, Response } from 'express';
import {
  createDesign as createDesignService,
  listDesigns as listDesignsService,
  getDesignById as getDesignByIdService,
  updateDesign as updateDesignService,
  deleteDesign as deleteDesignService,
} from '../services/design.service';
import { DesignCreateInput } from '../schemas/design.schema';

export const listDesigns = async (_req: Request, res: Response) => {
  const designs = await listDesignsService();
  res.status(200).json({ data: designs, error: null });
};

export const getDesignById = async (req: Request, res: Response) => {
  const design = await getDesignByIdService(req.params.id);
  res.status(200).json({ data: design, error: null });
};

export const createDesign = async (req: Request, res: Response) => {
  const payload = req.body as DesignCreateInput;
  const design = await createDesignService(payload);
  res.status(201).json({ data: design, error: null });
};

export const updateDesign = async (req: Request, res: Response) => {
  const updated = await updateDesignService(req.params.id, req.body);
  res.status(200).json({ data: updated, error: null });
};

export const deleteDesign = async (req: Request, res: Response) => {
  const deleted = await deleteDesignService(req.params.id);
  res.status(200).json({ data: { deleted }, error: null });
};
