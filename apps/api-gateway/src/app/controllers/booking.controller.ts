import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { DTO } from '@common';
import { TObservableRes } from '../types/observable-res.type';

@Controller('rooms')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get("/")
  getAllRooms(): TObservableRes<DTO.ROOMS.RoomBaseDTO[]> {
    return this.bookingService.getRoomsList();
  }

  @Get('/:num')
  getRoom(@Param('num') num: string): TObservableRes<DTO.ROOMS.RoomDTO> {
    const roomNumber = Number(num);
    if (isNaN(roomNumber)) {
      throw new BadRequestException('num must be integer');
    }
    return this.bookingService.getRoom(roomNumber);
  }
}
