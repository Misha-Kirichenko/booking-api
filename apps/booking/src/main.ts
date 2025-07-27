import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INTERCEPTORS } from '@common';

const { TransformInterceptor } = INTERCEPTORS;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(reflector),
  );
  const port = process.env.PORT;
  await app.listen(port);
  Logger.log(
    `🚀 Booking microservice is running on: http://localhost:${port}`
  );
}

bootstrap();
