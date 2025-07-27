import { Module, OnModuleInit } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsSeederService } from './rooms-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../db/entities/room.entity';
import { OverridePrice } from '../db/entities/override-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, OverridePrice])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSeederService],
})
export class RoomsModule implements OnModuleInit {
  constructor(private readonly roomSeederService: RoomsSeederService) { }
  async onModuleInit() {
    await this.roomSeederService.seed(100);
  }
}
