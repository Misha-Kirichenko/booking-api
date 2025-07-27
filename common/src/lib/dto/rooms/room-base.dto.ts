import { Expose } from 'class-transformer';

export class RoomBaseDTO {
  @Expose()
  num: number;

  @Expose()
  price: number;

  @Expose()
  img_1: string;
}
