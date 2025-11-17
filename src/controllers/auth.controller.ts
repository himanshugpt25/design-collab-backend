import { Request, Response } from 'express';
import { registerUser, loginUser, refreshTokens } from '../services/auth.service';
import { RegisterInput, LoginInput, RefreshInput } from '../schemas/auth.schema';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  const payload = req.body as RegisterInput;
  logger.info('AuthController.register.request', { email: payload.email });
  const result = await registerUser(payload);
  res.status(201).json({ data: result, error: null });
};

export const login = async (req: Request, res: Response) => {
  const payload = req.body as LoginInput;
  logger.info('AuthController.login.request', { email: payload.email });
  const result = await loginUser(payload);
  res.status(200).json({ data: result, error: null });
};

export const refresh = async (req: Request, res: Response) => {
  const payload = req.body as RefreshInput;
  logger.info('AuthController.refresh.request');
  const result = await refreshTokens(payload);
  res.status(200).json({ data: result, error: null });
};
