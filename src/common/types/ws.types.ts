import { JwtPayload } from './jwt.types';

export interface AppSocket {
  id: string;
  data: { user: JwtPayload };
  disconnect(close?: boolean): void;
}
