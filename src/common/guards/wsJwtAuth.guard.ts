import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AppSocket } from '../types/ws.types';

/**
 * Guard for @SubscribeMessage handlers.
 * Checks that the user was authenticated during the handshake
 * (by AuthenticatedSocketIoAdapter). Use with @UseGuards(WsJwtAuthGuard).
 */
@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<AppSocket>();

    if (!client.data?.user) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
