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
import { WebsocketModule } from './websocket/websocket.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AnnouncementModule,
    UserModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnnouncementMiddleware).forRoutes({
      path: '/announcement',
      method: RequestMethod.ALL,
    });
  }
}
