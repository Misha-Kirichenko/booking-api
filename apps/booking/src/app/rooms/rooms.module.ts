import { Module, OnModuleInit } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsSeederService } from './rooms-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@common';

@Module({
  imports: [TypeOrmModule.forFeature([
    ENTITIES.Room,
    ENTITIES.OverridePrice,
  ])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSeederService],
})
export class RoomsModule implements OnModuleInit {
  constructor(private readonly roomSeederService: RoomsSeederService) { }
  async onModuleInit() {
    await this.roomSeederService.seed(100);
  }
}
