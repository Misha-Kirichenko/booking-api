import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PagingDTO {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsNumber()
  @Transform(({ value }) => Boolean(value) && parseInt(value))
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ type: Number, example: 10 })
  @IsNumber()
  @Transform(({ value }) => Boolean(value) && parseInt(value))
  @IsOptional()
  limit?: number;
}
