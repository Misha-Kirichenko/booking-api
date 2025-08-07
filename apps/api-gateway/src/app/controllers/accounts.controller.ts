import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { INTERFACES } from '@common';
import { DTO } from '@common';
import { IProxyData, ITokensPair } from '../interfaces';
import { RefreshAuthGuard } from '../guards';
import { ProxyService } from '../proxy.service';
import { ServiceName } from '../enums/serviceName.enum';
import { Serialize } from '../decorators';
import { AuthGuard } from '../guards';


@Controller('accounts')
export class AccountsController {
  constructor(private readonly proxyService: ProxyService) { }

  @Post('/auth/login')
  login(@Body() loginDto: DTO.USER.LoginDTO): Promise<ITokensPair> {
    const proxyData: IProxyData = {
      url: 'auth/login',
      method: 'POST',
      payload: { body: loginDto },
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
      headers: req.headers,
      serviceName: ServiceName.ACCOUNTS,
    };
    return this.proxyService.handle<ITokensPair>(proxyData);
  }


  @UseGuards(AuthGuard)
  @Get('/users')
  getUsers(@Query() usersQueryDTO: DTO.USER.UsersQueryDTO, @Req() req: INTERFACES.IAuthorizedRequest): Promise<INTERFACES.IPagingData<DTO.USER.UserDTO>> {
    const proxyData: IProxyData = {
      url: 'users',
      method: 'GET',
      headers: req.headers,
      payload: { query: usersQueryDTO },
      serviceName: ServiceName.ACCOUNTS,
    };
    return this.proxyService.handle<INTERFACES.IPagingData<DTO.USER.UserDTO>>(proxyData);
  }



  @Serialize(DTO.USER.UserFullInfoDTO)
  @UseGuards(AuthGuard)
  @Get('/users/:id')
  getUser(@Req() req: INTERFACES.IAuthorizedRequest, @Param("id") id: string): Promise<DTO.USER.UserDTO> {
    const proxyData: IProxyData = {
      url: `users/${id}`,
      method: 'GET',
      headers: req.headers,
      serviceName: ServiceName.ACCOUNTS,
    };
    return this.proxyService.handle<DTO.USER.UserDTO>(proxyData);
  }
}
