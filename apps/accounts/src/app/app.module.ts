import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MODULES } from '@common';

@Module({
  imports: [MODULES.DbModule, AuthModule, UsersModule],
})
export class AppModule { }
