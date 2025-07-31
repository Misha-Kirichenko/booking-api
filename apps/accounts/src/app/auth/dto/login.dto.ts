import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin_password_123' })
  @IsNotEmpty()
  password: string;
}
