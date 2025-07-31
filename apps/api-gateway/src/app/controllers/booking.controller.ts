import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProxyService } from '../proxy.service';
import { DTO } from '@common';
import { Serialize } from '../decorators';
import { IProxyData } from '../interfaces';
import { ServiceName } from '../enums/serviceName.enum';
import { AuthGuard } from '../guards';


@Controller('booking')
export class BookingController {
  constructor(private readonly proxyService: ProxyService) { }

  @UseGuards(AuthGuard)
  @Serialize(DTO.ROOMS.RoomBaseDTO)
  @Get("/rooms")
  getAllRooms(): Promise<DTO.ROOMS.RoomBaseDTO[]> {
    const proxyData: IProxyData = {
      url: 'rooms',
      method: 'GET',
      serviceName: ServiceName.BOOKING,
    };
    return this.proxyService.handle<DTO.ROOMS.RoomBaseDTO[]>(proxyData);
  }


  @UseGuards(AuthGuard)
  @Serialize(DTO.ROOMS.RoomDTO)
  @Get('/rooms/:num')
  getRoom(@Param('num', ParseIntPipe) num: number): Promise<DTO.ROOMS.RoomDTO> {
    const proxyData: IProxyData = {
      url: `rooms/${num}`,
      method: 'GET',
      serviceName: ServiceName.BOOKING,
    };

    return this.proxyService.handle<DTO.ROOMS.RoomDTO>(proxyData);
  }
}
