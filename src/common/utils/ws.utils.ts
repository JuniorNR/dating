import { AppSocket } from '../types/ws.types';
import { JwtPayload } from '../types/jwt.types';

export function getWsUser(client: AppSocket): JwtPayload {
  return client.data.user;
}
