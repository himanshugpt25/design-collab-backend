import { Request, Response } from 'express';
import {
  createDesign as createDesignService,
  listDesigns as listDesignsService,
  getDesignById as getDesignByIdService,
  updateDesign as updateDesignService,
  deleteDesign as deleteDesignService,
} from '../services/design.service';
import { DesignCreateInput, DesignListQueryInput, DesignInput } from '../schemas/design.schema';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export const listDesigns = async (req: Request, res: Response) => {
  const query = req.query as DesignListQueryInput;
  logger.info('DesignController.listDesigns.request', { query });
  const designs = await listDesignsService(query);
  logger.info('DesignController.listDesigns.success', { count: designs.length });
  res.status(200).json({ data: designs, error: null });
};

export const getDesignById = async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.info('DesignController.getDesignById.request', { id });
  const design = await getDesignByIdService(id);
  if (!design) {
    logger.warn('DesignController.getDesignById.notFound', { id });
    throw new NotFoundError('Design not found');
  }
  logger.info('DesignController.getDesignById.success', { id });
  res.status(200).json({ data: design, error: null });
};

export const createDesign = async (req: Request, res: Response) => {
  const payload = req.body as DesignCreateInput;
  logger.info('DesignController.createDesign.request', { name: payload.name });
  const design = await createDesignService(payload);
  logger.info('DesignController.createDesign.success', { id: design._id });
  res.status(201).json({ data: design, error: null });
};

export const updateDesign = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body as DesignInput;
  logger.info('DesignController.updateDesign.request', { id, name: payload.name });
  const updated = await updateDesignService(id, payload);
  if (!updated) {
    logger.warn('DesignController.updateDesign.notFound', { id });
    throw new NotFoundError('Design not found');
  }
  logger.info('DesignController.updateDesign.success', { id });
  res.status(200).json({ data: updated, error: null });
};

export const deleteDesign = async (req: Request, res: Response) => {
  const { id } = req.params;
  logger.info('DesignController.deleteDesign.request', { id });
  const deleted = await deleteDesignService(id);
  if (!deleted) {
    logger.warn('DesignController.deleteDesign.notFound', { id });
    throw new NotFoundError('Design not found');
  }
  logger.info('DesignController.deleteDesign.success', { id });
  res.status(200).json({ data: { deleted }, error: null });
};
