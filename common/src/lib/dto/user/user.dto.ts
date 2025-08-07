import { Expose } from 'class-transformer';

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  email: string;

  @Expose()
  last_login: number;

  @Expose()
  blocked: boolean;
}
