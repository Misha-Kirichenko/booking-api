import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { INTERFACES } from '@common';
import { LoginDTO } from './dto/login.dto';
import { ITokensPair } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  login(@Body() loginDto: LoginDTO): Promise<ITokensPair> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Get('/refresh')
  refresh(@Headers('x-user-data') userData: string): Promise<ITokensPair> {
    const parsedUserData: INTERFACES.ITokenPayload = JSON.parse(userData);
    return this.authService.generateRefreshToken(parsedUserData);
  }
}
