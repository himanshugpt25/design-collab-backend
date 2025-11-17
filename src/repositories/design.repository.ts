import { Model } from 'mongoose';
import { DesignModel, DesignDocument } from '../models/Design';
import { DesignElement } from '../types/design';
import { DesignCreateInput } from '../schemas/design.schema';

export type CreateDesignPayload = DesignCreateInput & {
  elements: DesignElement[];
  thumbnailUrl?: string;
};

export const createDesignRepository = (model: Model<DesignDocument> = DesignModel) => ({
  create: (payload: CreateDesignPayload) => model.create(payload),
  findAll: () => model.find().sort({ updatedAt: -1 }).exec(),
  findById: (id: string) => model.findById(id).exec(),
  updateById: (id: string, update: Partial<CreateDesignPayload>) =>
    model.findByIdAndUpdate(id, update, { new: true }).exec(),
  deleteById: async (id: string) => Boolean(await model.findByIdAndDelete(id).exec()),
});
