import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...CONFIG,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true, //only in dev
      logging: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule { }
