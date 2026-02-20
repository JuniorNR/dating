import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { ServerOptions, Server, Socket } from 'socket.io';
import { AppSocket } from '../types/ws.types';
import { JwtPayload } from '../types/jwt.types';

export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.jwtService = app.get(JwtService);
  }

  createIOServer(port: number, options?: Partial<ServerOptions>): Server {
    const server: Server = super.createIOServer(port, options) as Server;

    const authMiddleware = (
      socket: Socket,
      next: (err?: Error) => void,
    ): void => {
      try {
        const token =
          (socket.handshake.auth as Record<string, string>)?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
          return next(new Error('Authentication token is missing'));
        }

        (socket as AppSocket).data.user =
          this.jwtService.verify<JwtPayload>(token);
        next();
      } catch {
        next(new Error('Invalid or expired token'));
      }
    };

    server.use(authMiddleware);
    server.on('new_namespace', (namespace) => {
      namespace.use(authMiddleware);
    });

    return server;
  }
}
