import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { INTERFACES } from '@common';
import { LoginDTO } from '../dto';
import { IProxyData, ITokensPair } from '../interfaces';
import { RefreshAuthGuard } from '../guards';
import { ProxyService } from '../proxy.service';
import { ServiceName } from '../enums/serviceName.enum';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly proxyService: ProxyService) { }

  @Post('/auth/login')
  login(@Body() loginDto: LoginDTO): Promise<ITokensPair> {
    const proxyData: IProxyData = {
      url: 'auth/login',
      method: 'POST',
      payload: loginDto,
      serviceName: ServiceName.ACCOUNTS,
    };
    return this.proxyService.handle<ITokensPair>(proxyData);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('/auth/refresh')
  refresh(@Req() req: INTERFACES.IAuthorizedRequest): Promise<ITokensPair> {
    const proxyData: IProxyData = {
      url: 'auth/refresh',
      method: 'GET',
      headers: {
        'x-user-data': JSON.stringify(req.user),
      },
      serviceName: ServiceName.ACCOUNTS,
    };
    return this.proxyService.handle<ITokensPair>(proxyData);
  }
}
