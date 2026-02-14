import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Dating API')
    .setDescription('The Dating API description')
    .setVersion('0.1')
    .addTag('dating')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  console.log('Swagger initialization http://localhost:3001/docs');

  await app.listen(process.env['PORT'] || 3001);

  console.log(`App is listening on port=${process.env['PORT'] || 3001}`);
}
void bootstrap();
