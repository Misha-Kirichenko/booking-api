import { MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsSeederService } from './rooms-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@common';
import { JwtService } from '@nestjs/jwt';
import { MIDDLEWARES } from '@common';

const { ExtractAuthPayload } = MIDDLEWARES;

@Module({
  imports: [TypeOrmModule.forFeature([
    ENTITIES.Room,
    ENTITIES.OverridePrice,
    ENTITIES.User
  ])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSeederService, JwtService],
})
export class RoomsModule implements NestModule, OnModuleInit {
  constructor(private readonly roomSeederService: RoomsSeederService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractAuthPayload)
      .exclude({ path: 'rooms', method: RequestMethod.GET })
      .forRoutes('*');
  }

  async onModuleInit() {
    await this.roomSeederService.seed(100);
  }

}
