import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';

@WebSocketGateway(Number(process.env['WEBSOCKET_PORT']) || 3002, {
  namespace: process.env['WEBSOCKET_NS'] || 'ws',
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() Server: Server;
  namespace: Namespace;

  afterInit(/*server: Server*/) {
    console.log(
      `WS initialized on: ${process.env['APP_PROTOCOL']}://${process.env['APP_DOMAIN']}:${process.env['WEBSOCKET_PORT']}/${process.env['WEBSOCKET_NAMESPACE']}`,
    );
  }

  handleConnection(/*client: Socket*/) {
    console.log('WS connection');
  }

  handleDisconnect(/*client: Socket*/) {
    console.log('WS disconnection');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('Message ', message);

    this.Server.emit('message', `Echo: ${message}`);
  }
}
