import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DTO } from '@common';
import { ITokensPair } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  login(@Body() loginDto: DTO.USER.LoginDTO): Promise<ITokensPair> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Get('/refresh')
  refresh(@Headers() headers: Record<string, any>): Promise<ITokensPair> {
    return this.authService.refreshToken(headers);
  }
}
