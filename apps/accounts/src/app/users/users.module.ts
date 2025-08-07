import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSeederService } from './users.seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@common';
import { ExtractAuthPayload } from 'common/src/lib/middlewares';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ENTITIES.User])],
  providers: [UsersService, UsersSeederService, JwtService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly usersSeederService: UsersSeederService) { }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractAuthPayload)
      .forRoutes('*');
  }
  async onModuleInit() {
    await this.usersSeederService.seed(100);
  }
}
