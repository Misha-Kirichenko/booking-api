import { Expose, Type } from "class-transformer";
import { UserDTO } from "./user.dto";
import { BookingDTO } from "../bookings";

export class UserFullInfoDTO extends UserDTO {
  @Expose()
  block_reason: string | null;

  @Expose()
  @Type(() => BookingDTO)
  bookings: BookingDTO[];
}
