import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from './config';
import { Room, User, Booking, OverridePrice } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...CONFIG,
      type: 'postgres',
      autoLoadEntities: true,
      entities: [Room, User, Booking, OverridePrice],
      synchronize: true, //only in dev
      logging: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule { }
