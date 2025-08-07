import { Expose } from "class-transformer";

export class BookingRoomDTO {
  @Expose()
  num: number;

  @Expose()
  price: number;
}
