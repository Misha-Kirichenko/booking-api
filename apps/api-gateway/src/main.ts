import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AxiosErrorFilter } from './app/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT;
  app.useGlobalFilters(new AxiosErrorFilter());
  await app.listen(port);
  Logger.log(
    `🚀 Api-gateway is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
