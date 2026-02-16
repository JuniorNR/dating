import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: { id: number; name: string; type: string }[];
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
