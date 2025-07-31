import { Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersSeederService } from './users.seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@common';

@Module({
  imports: [TypeOrmModule.forFeature([ENTITIES.User])],
  providers: [UsersService, UsersSeederService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly usersSeederService: UsersSeederService) { }
  async onModuleInit() {
    await this.usersSeederService.seed(100);
  }
}
