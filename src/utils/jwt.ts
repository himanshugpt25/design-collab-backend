import jwt, { SignOptions, JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_TOKEN_EXPIRY = (process.env.JWT_ACCESS_EXPIRES_IN ||
  '15m') as SignOptions['expiresIn'];
const REFRESH_TOKEN_EXPIRY = (process.env.JWT_REFRESH_EXPIRES_IN ||
  '7d') as SignOptions['expiresIn'];

interface JwtPayload extends BaseJwtPayload {
  sub: string;
  email: string;
  name?: string;
}

const accessTokenOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY };
const refreshTokenOptions: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY };

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, accessTokenOptions);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};
