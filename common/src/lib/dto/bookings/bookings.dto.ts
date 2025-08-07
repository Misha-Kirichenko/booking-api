import { Expose, Type } from "class-transformer";
import { BookingRoomDTO } from "./bookingRoom.dto";
import { OverridePriceDTO } from "../rooms";

export class BookingDTO {
  @Expose()
  id: string;

  @Expose()
  day_from: string;

  @Expose()
  day_to: string;

  @Expose()
  @Type(() => BookingRoomDTO)
  room: BookingRoomDTO;

  @Expose()
  snapshot_price: number;

  @Expose()
  total_price: number;

  @Expose()
  created_at: number;

  @Expose()
  @Type(() => OverridePriceDTO)
  override_prices: OverridePriceDTO[];
}
