import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthenticatedSocketIoAdapter } from './common/adapters/authenticated-socket-io.adapter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Dating API')
    .setDescription('The Dating API description')
    .setVersion('0.1')
    .addTag('User', 'Operations with users')
    .addTag('Announcement', 'Operations with announcements')
    .addTag('Role', 'Operations with roles')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    process.env['SWAGGER_NAMESPACE'] || 'docs',
    app,
    documentFactory,
  );
  console.log(
    `Swagger is initialized on: ${process.env['APP_PROTOCOL']}://${process.env['APP_DOMAIN'] || 'localhost'}:${process.env['APP_PORT'] || 3001}/${process.env['SWAGGER_NAMESPACE']}`,
  );

  await app.listen(process.env['APP_PORT'] || 3001);

  console.log(
    `App is listening on: ${process.env['APP_DOMAIN'] || 'localhost'}:${process.env['APP_PORT'] || 3001}`,
  );
}
void bootstrap();
