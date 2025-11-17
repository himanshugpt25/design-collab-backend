import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Unauthorized' }, data: null });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, email: decoded.email, name: decoded.name };
    return next();
  } catch (error) {
    logger.warn('AuthMiddleware.invalidToken');
    return res.status(401).json({ error: { message: 'Unauthorized' }, data: null });
  }
};
