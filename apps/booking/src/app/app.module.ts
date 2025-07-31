import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { MODULES } from '@common';

@Module({
  imports: [MODULES.DbModule, RoomsModule],
})
export class AppModule { }
