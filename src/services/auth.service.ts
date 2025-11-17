import { createUserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput, RefreshInput } from '../schemas/auth.schema';
import { User } from '../types/user';
import { logger } from '../utils/logger';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { UserDocument } from '../models/User';

const userRepository = createUserRepository();

const sanitizeUser = (user: UserDocument): User => ({
  _id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const generateTokens = (user: UserDocument) => {
  const payload = { sub: user.id, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const registerUser = async (payload: RegisterInput) => {
  logger.info('AuthService.register.start', { email: payload.email });
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw new ConflictError('Email already in use');
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await userRepository.create({
    email: payload.email,
    name: payload.name,
    passwordHash,
  });

  const { accessToken, refreshToken } = generateTokens(user);
  await userRepository.updateRefreshToken(user.id, await hashPassword(refreshToken));

  logger.info('AuthService.register.success', { userId: user.id });
  return { user: sanitizeUser(user), tokens: { accessToken, refreshToken } };
};

export const loginUser = async (payload: LoginInput) => {
  logger.info('AuthService.login.start', { email: payload.email });
  const user = await userRepository.findByEmail(payload.email);
  if (!user) {
    logger.warn('AuthService.login.userNotFound', { email: payload.email });
    throw new NotFoundError('Invalid credentials');
  }

  const isMatch = await comparePassword(payload.password, user.passwordHash);
  if (!isMatch) {
    logger.warn('AuthService.login.invalidPassword', { email: payload.email });
    throw new NotFoundError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await userRepository.updateRefreshToken(user.id, await hashPassword(refreshToken));

  logger.info('AuthService.login.success', { userId: user.id });
  return { user: sanitizeUser(user), tokens: { accessToken, refreshToken } };
};

export const refreshTokens = async (payload: RefreshInput) => {
  logger.info('AuthService.refresh.start');
  let decoded;
  try {
    decoded = verifyRefreshToken(payload.refreshToken);
  } catch (error) {
    logger.warn('AuthService.refresh.invalidToken');
    throw new BadRequestError('Invalid refresh token');
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user || !user.refreshTokenHash) {
    logger.warn('AuthService.refresh.userNotFound', { userId: decoded.sub });
    throw new BadRequestError('Invalid refresh token');
  }

  const isMatch = await comparePassword(payload.refreshToken, user.refreshTokenHash);
  if (!isMatch) {
    logger.warn('AuthService.refresh.hashMismatch', { userId: decoded.sub });
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await userRepository.updateRefreshToken(user.id, await hashPassword(refreshToken));

  logger.info('AuthService.refresh.success', { userId: user.id });
  return { user: sanitizeUser(user), tokens: { accessToken, refreshToken } };
};
