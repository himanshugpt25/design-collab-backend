import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export const UserModel = model<UserDocument>('User', userSchema);
