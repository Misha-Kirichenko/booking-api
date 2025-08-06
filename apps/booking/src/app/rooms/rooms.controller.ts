import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { DTO, GUARDS } from '@common';


@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Get("/")
  getRoomsList(): Promise<DTO.ROOMS.RoomBaseDTO[]> {
    return this.roomsService.getRoomsList();
  }

  @UseGuards(GUARDS.IsBlockedGuard)
  @Get("/:num")
  getRooms(@Param('num') num: number): Promise<DTO.ROOMS.RoomDTO> {
    return this.roomsService.getRoom(num);
  }
}
