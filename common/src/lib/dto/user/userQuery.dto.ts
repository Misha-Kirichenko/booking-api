import { IsBoolean, IsOptional } from "class-validator";
import { PagingDTO } from "../common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UsersQueryDTO extends PagingDTO {
  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase() === "true" ? true : value?.toLowerCase() === "false" ? false : undefined)
  @IsBoolean()
  blocked?: boolean;
}
