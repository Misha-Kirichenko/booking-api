import { Expose, Type } from 'class-transformer';
import { OverridePriceDTO } from './override-price.dto';
import { RoomBaseDTO } from './room-base.dto';

export class RoomDTO extends RoomBaseDTO {
  @Expose()
  img_2: string;

  @Expose()
  img_3: string;

  @Expose()
  img_4: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => OverridePriceDTO)
  override_prices: OverridePriceDTO[];
}
