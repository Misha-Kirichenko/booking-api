import { Controller, Get, Param } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { DTO } from '@common';


@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Get("/")
  getRoomsList(): Promise<DTO.ROOMS.RoomBaseDTO[]> {
    return this.roomsService.getRoomsList();
  }

  @Get("/:num")
  getRooms(@Param('num') num: number): Promise<DTO.ROOMS.RoomDTO> {
    return this.roomsService.getRoom(num);
  }
}
