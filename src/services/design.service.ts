import { DesignDocument } from '../models/Design';
import { Design, DesignSummary } from '../types/design';
import { DesignCreateInput, DesignListQueryInput } from '../schemas/design.schema';
import { createDesignRepository, CreateDesignPayload } from '../repositories/design.repository';

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
  const designDoc = await designRepository.create({
    ...payload,
    elements: [],
  });

  return mapDesignDocument(designDoc);
};

export const listDesigns = async (query: DesignListQueryInput = {}): Promise<DesignSummary[]> => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const designs = await designRepository.findAll({
    limit,
    offset,
    projection: {
      name: 1,
      updatedAt: 1,
      thumbnailUrl: 1,
    },
  });

  return designs.map(mapDesignSummary);
};

export const getDesignById = async (id: string): Promise<Design | null> => {
  const designDoc = await designRepository.findById(id);
  return designDoc ? mapDesignDocument(designDoc) : null;
};

export const updateDesign = async (
  id: string,
  payload: Partial<CreateDesignPayload>
): Promise<Design | null> => {
  const updatedDoc = await designRepository.updateById(id, payload);
  return updatedDoc ? mapDesignDocument(updatedDoc) : null;
};

export const deleteDesign = async (id: string): Promise<boolean> => {
  return designRepository.deleteById(id);
};
