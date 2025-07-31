import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';
import { JwtService } from '@nestjs/jwt';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AccountsController, BookingController],
  providers: [ProxyService, JwtService],
})
export class AppModule { }
