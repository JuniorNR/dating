import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { AppSocket } from '../common/types/ws.types';

@WebSocketGateway(Number(process.env['WEBSOCKET_PORT']) || 3002, {
  namespace: 'ws',
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  namespace: Namespace;

  afterInit() {
    console.log(
      `WS initialized on: ${process.env['APP_PROTOCOL']}://${process.env['APP_DOMAIN']}:${process.env['WEBSOCKET_PORT']}/${process.env['WEBSOCKET_NAMESPACE']}`,
    );
  }

  handleConnection(client: AppSocket) {
    const { username, sub } = client.data.user;
    console.log(
      `[WS][ws][connection]: ${client.id} (user: ${username}, id: ${sub})`,
    );
  }

  handleDisconnect(client: AppSocket) {
    const { username, sub } = client.data.user;
    console.log(
      `[WS][ws][disconnect]: ${client.id} (user: ${username}, id: ${sub})`,
    );
  }
}
