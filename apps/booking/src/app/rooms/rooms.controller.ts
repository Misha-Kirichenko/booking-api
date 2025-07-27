import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { DTO, DECORATORS } from '@common';

const { Serialize } = DECORATORS;

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Serialize(DTO.ROOMS.RoomBaseDTO)
  @Get("/")
  getRoomsList(): Promise<DTO.ROOMS.RoomBaseDTO[]> {
    return this.roomsService.getRoomsList();
  }

  @Serialize(DTO.ROOMS.RoomDTO)
  @Get("/:num")
  getRooms(@Param('num', ParseIntPipe) num: number): Promise<DTO.ROOMS.RoomDTO> {
    return this.roomsService.getRoom(num);
  }
}
