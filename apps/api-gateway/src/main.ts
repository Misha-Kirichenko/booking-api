import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AxiosErrorFilter } from './app/filters';
import { TransformInterceptor } from './app/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(reflector),
  );
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT;
  app.useGlobalFilters(new AxiosErrorFilter());
  await app.listen(port);
  Logger.log(
    `🚀 Api-gateway microservice is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
