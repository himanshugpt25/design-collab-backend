import { DesignDocument } from '../models/Design';
import { Design, DesignSummary } from '../types/design';
import { DesignCreateInput, DesignListQueryInput } from '../schemas/design.schema';
import { createDesignRepository, UpdateDesignPayload } from '../repositories/design.repository';
import { logger } from '../utils/logger';

const mapDesignDocument = (doc: DesignDocument): Design => ({
  _id: doc.id,
  name: doc.name,
  width: doc.width,
  height: doc.height,
  elements: doc.elements,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
  thumbnailUrl: doc.thumbnailUrl,
});

const mapDesignSummary = (doc: DesignDocument): DesignSummary => ({
  _id: doc.id,
  name: doc.name,
  updatedAt: doc.updatedAt.toISOString(),
  thumbnailUrl: doc.thumbnailUrl,
});

const designRepository = createDesignRepository();

export const createDesign = async (payload: DesignCreateInput): Promise<Design> => {
  logger.info('DesignService.createDesign.start', { name: payload.name });
  const designDoc = await designRepository.create({
    ...payload,
    elements: [],
  });

  logger.info('DesignService.createDesign.success', { id: designDoc.id });
  return mapDesignDocument(designDoc);
};

export const listDesigns = async (query: DesignListQueryInput = {}): Promise<DesignSummary[]> => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  logger.info('DesignService.listDesigns.start', { limit, offset });

  const designs = await designRepository.findAll({
    limit,
    offset,
    projection: {
      name: 1,
      updatedAt: 1,
      thumbnailUrl: 1,
    },
  });

  logger.info('DesignService.listDesigns.success', { count: designs.length });
  return designs.map(mapDesignSummary);
};

export const getDesignById = async (id: string): Promise<Design | null> => {
  logger.info('DesignService.getDesignById.start', { id });
  const designDoc = await designRepository.findById(id);
  if (!designDoc) {
    logger.warn('DesignService.getDesignById.notFound', { id });
    return null;
  }
  logger.info('DesignService.getDesignById.success', { id });
  return mapDesignDocument(designDoc);
};

export const updateDesign = async (
  id: string,
  payload: UpdateDesignPayload
): Promise<Design | null> => {
  logger.info('DesignService.updateDesign.start', { id, name: payload.name });
  const updatedDoc = await designRepository.updateById(id, payload);
  if (!updatedDoc) {
    logger.warn('DesignService.updateDesign.notFound', { id });
    return null;
  }
  logger.info('DesignService.updateDesign.success', { id });
  return mapDesignDocument(updatedDoc);
};

export const deleteDesign = async (id: string): Promise<boolean> => {
  logger.info('DesignService.deleteDesign.start', { id });
  const deleted = await designRepository.deleteById(id);
  if (!deleted) {
    logger.warn('DesignService.deleteDesign.notFound', { id });
    return false;
  }
  logger.info('DesignService.deleteDesign.success', { id });
  return true;
};
