import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as path from 'path';
import { CookieResolver, I18nModule } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnnouncementModule } from './announcement/announcement.module';
import { AnnouncementMiddleware } from './announcement/announcement.middleware';
import { WebsocketModule } from './websocket/websocket.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwtAuth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: path.join(__dirname, '../i18n'),
          watch: true,
        },
      }),
      resolvers: [new CookieResolver()],
      inject: [ConfigService],
    }),
    WebsocketModule,
    AuthModule,
    UserModule,
    RoleModule,
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnnouncementMiddleware).forRoutes({
      path: '/announcement',
      method: RequestMethod.ALL,
    });
  }
}
