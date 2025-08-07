import { Expose } from 'class-transformer';

export class OverridePriceDTO {
  @Expose()
  day: string;

  @Expose()
  price: number;

  @Expose()
  reason?: string;
}
