import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule, RoomsModule],
})
export class AppModule { }
