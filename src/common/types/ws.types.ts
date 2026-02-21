import { Socket } from 'socket.io';
import { JwtPayload } from './jwt.types';

export interface AppSocket extends Socket {
  id: string;
  data: { user: JwtPayload };
}
