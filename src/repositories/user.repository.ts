import { Model } from 'mongoose';
import { UserModel, UserDocument } from '../models/User';

export interface CreateUserPayload {
  email: string;
  name?: string;
  passwordHash: string;
}

export interface UpdateUserRefreshTokenPayload {
  refreshTokenHash?: string | null;
}

export const createUserRepository = (model: Model<UserDocument> = UserModel) => ({
  create: (payload: CreateUserPayload) => model.create(payload),
  findByEmail: (email: string) => model.findOne({ email }).exec(),
  findById: (id: string) => model.findById(id).exec(),
  updateRefreshToken: (id: string, refreshTokenHash: string | null) =>
    model
      .findByIdAndUpdate(
        id,
        { refreshTokenHash: refreshTokenHash || undefined },
        { new: true }
      )
      .exec(),
});
