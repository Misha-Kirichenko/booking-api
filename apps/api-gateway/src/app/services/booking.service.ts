import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { DTO } from '@common';
import { TObservableRes } from '../types/observable-res.type';

@Injectable()
export class BookingService {
  private roomsPostFix: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const bookingUrl = this.configService.get<string>('BOOKING_SERVICE_URL');
    this.roomsPostFix = `${bookingUrl}/rooms`;
  }

  public async getRoomsList(): TObservableRes<DTO.ROOMS.RoomBaseDTO[]> {
    const res = await firstValueFrom(this.httpService.get(this.roomsPostFix));
    return res.data;
  }

  public async getRoom(id: number): TObservableRes<DTO.ROOMS.RoomDTO> {
    const res = await firstValueFrom(this.httpService.get(`${this.roomsPostFix}/${id}`));
    return res.data;
  }
}
