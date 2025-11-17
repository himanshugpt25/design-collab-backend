import { Model } from 'mongoose';
import { DesignModel, DesignDocument } from '../models/Design';
import { DesignElement } from '../types/design';
import { DesignCreateInput } from '../schemas/design.schema';

export type CreateDesignPayload = DesignCreateInput & {
  elements: DesignElement[];
  thumbnailUrl?: string;
};

interface ListDesignOptions {
  limit?: number;
  offset?: number;
  projection?: Record<string, 0 | 1>;
}

export const createDesignRepository = (model: Model<DesignDocument> = DesignModel) => ({
  create: (payload: CreateDesignPayload) => model.create(payload),
  findAll: ({ limit, offset, projection }: ListDesignOptions = {}) => {
    let query = model.find({}, projection).sort({ updatedAt: -1 });
    if (typeof offset === 'number') {
      query = query.skip(offset);
    }
    if (typeof limit === 'number') {
      query = query.limit(limit);
    }
    return query.exec();
  },
  findById: (id: string) => model.findById(id).exec(),
  updateById: (id: string, update: Partial<CreateDesignPayload>) =>
    model.findByIdAndUpdate(id, update, { new: true }).exec(),
  deleteById: async (id: string) => Boolean(await model.findByIdAndDelete(id).exec()),
});
