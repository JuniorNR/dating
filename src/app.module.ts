import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnnouncementModule } from './announcement/announcement.module';
import { AnnouncementMiddleware } from './announcement/announcement.middleware';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnnouncementMiddleware).forRoutes({
      path: '/announcement',
      method: RequestMethod.ALL,
    });
  }
}
